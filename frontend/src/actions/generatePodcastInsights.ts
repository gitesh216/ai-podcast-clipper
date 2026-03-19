"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

type PodcastInsights = {
  summary: string;
  keyInsights: string[];
  keyMoments: {
    title: string;
    start_time: number;
    end_time: number;
    description: string;
  }[];
  chapters: {
    title: string;
    start_time: number;
    end_time: number;
  }[];
};

async function fetchTranscriptFromS3(s3Key: string) {
  const folderPrefix = s3Key.split("/")[0]!;
  const transcriptKey = `${folderPrefix}/transcript.json`;

  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: transcriptKey,
    });

    const response = await s3Client.send(command);
    const body = await response.Body?.transformToString("utf-8");
    if (!body) throw new Error("Transcript file is empty");

    return body;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown transcript fetch error";
    throw new Error(
      `Transcript not found for this upload. Please ensure processing has completed. (${message})`,
    );
  }
}

function cleanJsonString(raw: string): string {
  return raw.replace(/```json/g, "").replace(/```/g, "").trim();
}

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

async function callGemini(prompt: string) {
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function parseJsonWithRetry<T>(
  getText: () => Promise<string>,
): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = await getText();
    try {
      const cleaned = cleanJsonString(raw);
      return JSON.parse(cleaned) as T;
    } catch (error) {
      if (attempt === 1) {
        throw new Error(
          `Failed to parse JSON from model response: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }
  }
  throw new Error("Unreachable");
}

async function callInsightsModel(transcript: string): Promise<PodcastInsights> {
  const SYSTEM_PROMPT =
    "You are an expert podcast analyst and content intelligence system.\n\nYour task is to deeply analyze a podcast transcript and generate structured insights that help a user quickly understand and navigate the content.\n\nThe transcript contains timestamps. You MUST preserve time context when extracting moments.\n\nYour output MUST be strictly valid JSON.\nDo not include any explanation outside JSON.";

  const MASTER_USER_PROMPT = `
Given the following podcast transcript (with timestamps), generate:

1. A concise but informative summary (max 200 words)
2. 5-8 key insights (actionable or learning-focused points)
3. Key moments:
   - title (short and engaging)
   - start_time (in seconds)
   - end_time (in seconds)
   - description (why this moment matters)
4. Chapters:
   - title
   - start_time
   - end_time

STRICT OUTPUT FORMAT:

{
  "summary": "string",
  "keyInsights": ["string"],
  "keyMoments": [
    {
      "title": "string",
      "start_time": number,
      "end_time": number,
      "description": "string"
    }
  ],
  "chapters": [
    {
      "title": "string",
      "start_time": number,
      "end_time": number
    }
  ]
}

IMPORTANT:
- Use timestamps from transcript
- Do NOT hallucinate timestamps
- Keep titles short and clickable
- Ensure valid JSON
`;

  const buildFullPrompt = (userPrompt: string) => `
${SYSTEM_PROMPT}

---

${userPrompt}
`;

  // If transcript is small enough, call once with the master prompt.
  if (transcript.length < 8000) {
    return parseJsonWithRetry<PodcastInsights>(async () => {
      const fullPrompt = buildFullPrompt(
        `${MASTER_USER_PROMPT}\n\nTranscript:\n${transcript}`,
      );
      return await callGemini(fullPrompt);
    });
  }

  // Hierarchical summarization for long transcripts.
  const CHUNK_SIZE = 6000; // characters, rough proxy for 1500–2000 tokens
  const chunks: string[] = [];
  for (let i = 0; i < transcript.length; i += CHUNK_SIZE) {
    chunks.push(transcript.slice(i, i + CHUNK_SIZE));
  }

  type ChunkSummary = {
    chunk_summary: string;
    important_points: string[];
    moments: {
      title: string;
      start_time: number;
      end_time: number;
      description: string;
    }[];
  };

  const CHUNK_USER_PROMPT = `
You are analyzing a CHUNK of a podcast transcript.

For this chunk ONLY:
- Summarize the key ideas.
- Extract important learning points.
- Extract any notable moments with timestamps when available.

Return STRICT JSON:
{
  "chunk_summary": "string",
  "important_points": ["string"],
  "moments": [
    {
      "title": "string",
      "start_time": number,
      "end_time": number,
      "description": "string"
    }
  ]
}

Do not include any explanation outside JSON.`;

  const chunkSummaries: ChunkSummary[] = [];

  for (const [index, chunk] of chunks.entries()) {
    // eslint-disable-next-line no-await-in-loop
    const result = await parseJsonWithRetry<ChunkSummary>(async () => {
      const fullPrompt = buildFullPrompt(
        `${CHUNK_USER_PROMPT}\n\nChunk index: ${index}\n\nTranscript chunk:\n${chunk}`,
      );
      return await callGemini(fullPrompt);
    });
    chunkSummaries.push(result);
  }

  const combinedSummaries = chunkSummaries
    .map(
      (c, idx) =>
        `Chunk ${idx} summary:\n${c.chunk_summary}\nImportant points:\n${c.important_points.join(
          "\n",
        )}\nMoments:\n${c.moments
          .map(
            (m) =>
              `- ${m.title} [${m.start_time} -> ${m.end_time}]: ${m.description}`,
          )
          .join("\n")}`,
    )
    .join("\n\n---\n\n");

  return parseJsonWithRetry<PodcastInsights>(async () => {
    const fullPrompt = buildFullPrompt(
      `${MASTER_USER_PROMPT}\n\nYou are given combined summaries and important moments from multiple transcript chunks. Use them to produce a single, coherent set of insights for the whole podcast.\n\nCombined chunk summaries:\n${combinedSummaries}`,
    );
    return await callGemini(fullPrompt);
  });
}

export async function generatePodcastInsights(uploadedFileId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // NOTE: Prisma types may lag behind schema changes in some setups.
  // We keep this narrowed to only fields used by this action.
  const uploadedFile = (await db.uploadedFile.findUniqueOrThrow({
    where: { id: uploadedFileId },
    include: {
      user: true,
    },
  })) as unknown as {
    id: string;
    userId: string;
    s3Key: string;
    summaryStatus: string;
    summary: string | null;
    keyInsights: unknown;
    keyMoments: unknown;
    chapters: unknown;
    user: {
      credits: number;
    };
  };

  if (uploadedFile.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (uploadedFile.summaryStatus === "processing") {
    // Avoid duplicate processing; caller can poll status.
    return {
      status: uploadedFile.summaryStatus,
      summary: uploadedFile.summary,
      keyInsights: uploadedFile.keyInsights,
      keyMoments: uploadedFile.keyMoments,
      chapters: uploadedFile.chapters,
    };
  }

  if (uploadedFile.summaryStatus === "completed" && uploadedFile.summary) {
    // Credit safety: return existing insights without extra cost.
    return {
      status: uploadedFile.summaryStatus,
      summary: uploadedFile.summary,
      keyInsights: uploadedFile.keyInsights,
      keyMoments: uploadedFile.keyMoments,
      chapters: uploadedFile.chapters,
    };
  }

  if (uploadedFile.user.credits <= 0) {
    throw new Error("Insufficient credits");
  }

  // Mark as processing to avoid races.
  await db.uploadedFile.update({
    where: { id: uploadedFileId },
    data: { summaryStatus: "processing" } as any,
  });

  try {
    const transcript = await fetchTranscriptFromS3(uploadedFile.s3Key);

    const insights = await callInsightsModel(transcript);

    // Deduct exactly 1 credit for insights generation.
    const [, updatedFile] = await db.$transaction([
      db.user.update({
        where: { id: uploadedFile.userId },
        data: {
          credits: {
            decrement: 1,
          },
        },
      }),
      db.uploadedFile.update({
        where: { id: uploadedFileId },
        data: {
          summaryStatus: "completed",
          summary: insights.summary,
          keyInsights: insights.keyInsights,
          keyMoments: insights.keyMoments,
          chapters: insights.chapters,
        } as any,
      }),
    ]);

    return {
      status: (updatedFile as any).summaryStatus,
      summary: (updatedFile as any).summary,
      keyInsights: (updatedFile as any).keyInsights,
      keyMoments: (updatedFile as any).keyMoments,
      chapters: (updatedFile as any).chapters,
    };
  } catch (error) {
    await db.uploadedFile.update({
      where: { id: uploadedFileId },
      data: { summaryStatus: "failed" } as any,
    });
    throw error;
  }
}

