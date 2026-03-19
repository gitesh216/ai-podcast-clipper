import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redirect } from "next/navigation";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { PodcastInsightsClient } from "~/app/dashboard/podcast/[id]/podcast-insights-client";

type PodcastPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PodcastPage({ params }: PodcastPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // NOTE: Prisma types may lag behind schema changes in some setups.
  // Narrowly type only the fields this page uses.
  const uploadedFile = (await db.uploadedFile.findFirstOrThrow({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      clips: true,
    },
  })) as unknown as {
    id: string;
    s3Key: string;
    summaryStatus: string;
    summary: string | null;
    keyInsights: unknown;
    keyMoments: unknown;
    chapters: unknown;
    clips: {
      id: string;
      s3Key: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      uploadedFileId: string | null;
    }[];
  };

  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: uploadedFile.s3Key,
  });

  const videoUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return (
    <PodcastInsightsClient
      uploadedFileId={uploadedFile.id}
      videoUrl={videoUrl}
      initialSummaryStatus={uploadedFile.summaryStatus}
      initialSummary={uploadedFile.summary}
      initialKeyInsights={uploadedFile.keyInsights}
      initialKeyMoments={uploadedFile.keyMoments}
      initialChapters={uploadedFile.chapters}
      clips={uploadedFile.clips}
    />
  );
}

