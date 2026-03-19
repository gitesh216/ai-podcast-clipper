"use client";

import { useRef, useState } from "react";
import { type Clip } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { generatePodcastInsights } from "~/actions/generatePodcastInsights";

type PodcastInsightsClientProps = {
  uploadedFileId: string;
  videoUrl: string;
  initialSummaryStatus: string;
  initialSummary: string | null;
  initialKeyInsights: unknown;
  initialKeyMoments: unknown;
  initialChapters: unknown;
  clips: Clip[];
};

export function PodcastInsightsClient({
  uploadedFileId,
  videoUrl,
  initialSummaryStatus,
  initialSummary,
  initialKeyInsights,
  initialKeyMoments,
  initialChapters,
}: PodcastInsightsClientProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [status, setStatus] = useState(initialSummaryStatus);
  const [insights, setInsights] = useState<any | null>(
    initialSummary
      ? {
          status: initialSummaryStatus,
          summary: initialSummary,
          keyInsights: initialKeyInsights,
          keyMoments: initialKeyMoments,
          chapters: initialChapters,
        }
      : null,
  );

  const handleGenerateInsights = async () => {
    try {
      setLoadingInsights(true);
      setInsightsError(null);
      const result = await generatePodcastInsights(uploadedFileId);
      setInsights(result);
      setStatus(result.status);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to generate insights.";
      // Friendlier copy for missing transcript.json errors.
      if (message.toLowerCase().includes("transcript not found")) {
        setInsightsError(
          "This video is processed, but the transcript wasn’t generated yet. Please try again in a few minutes.",
        );
      } else {
        setInsightsError(message);
      }
    } finally {
      setLoadingInsights(false);
    }
  };

  const seekTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    videoRef.current.play();
  };

  const hasSummary = Boolean(insights?.summary);
  const isProcessing = status === "processing";

  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Podcast</CardTitle>
        </CardHeader>
        <CardContent>
          <video
            ref={videoRef}
            controls
            className="aspect-video w-full rounded-md bg-black"
            src={videoUrl}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="clips">
        <TabsList>
          <TabsTrigger value="clips">Clips</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="clips">
          <p className="text-sm text-muted-foreground">
            Clips view will be implemented here.
          </p>
        </TabsContent>

        <TabsContent value="summary">
          {!hasSummary && (
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-muted-foreground">
                Use AI to analyze this podcast and extract key insights.
              </p>
              {insightsError && (
                <p className="text-sm text-red-600">{insightsError}</p>
              )}
              <Button
                onClick={handleGenerateInsights}
                disabled={loadingInsights || isProcessing}
              >
                {loadingInsights || isProcessing
                  ? "Analyzing podcast… (~20–40s)"
                  : "Generate Summary"}
              </Button>
              {isProcessing && !loadingInsights && (
                <p className="text-xs text-muted-foreground">
                  Summary generation already in progress. You can refresh this
                  page in a moment.
                </p>
              )}
            </div>
          )}

          {hasSummary && insights && (
            <div className="space-y-6">
              <p className="text-xs text-muted-foreground">
                Summary already generated. You can revisit this page anytime
                without using extra credits.
              </p>

              <section>
                <h2 className="text-lg font-semibold">Summary</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {insights.summary}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold">Key Insights</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {Array.isArray(insights.keyInsights) &&
                    insights.keyInsights.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold">Key Moments</h2>
                <div className="mt-2 space-y-2">
                  {Array.isArray(insights.keyMoments) &&
                    insights.keyMoments.map(
                      (
                        moment: {
                          title: string;
                          start_time: number;
                          end_time: number;
                          description: string;
                        },
                        idx: number,
                      ) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between rounded-md border p-3"
                        >
                          <div>
                            <button
                              type="button"
                              className="text-sm font-medium underline"
                              onClick={() => seekTo(moment.start_time)}
                            >
                              {moment.title}
                            </button>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {moment.description}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(moment.start_time / 60)
                              .toString()
                              .padStart(1, "0")}
                            :
                            {(moment.start_time % 60)
                              .toFixed(0)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        </div>
                      ),
                    )}
                </div>
              </section>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

