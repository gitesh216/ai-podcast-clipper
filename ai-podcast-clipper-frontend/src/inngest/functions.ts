import { inngest } from "./client";

export const processVideo = inngest.createFunction(
  { id: "process-video" },
  { event: "process-video-events" },
  async ({ event, step }) => {
    return { message: `Hello ${event.data.email}!` };
  },
);