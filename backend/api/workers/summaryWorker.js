// workers/summaryWorker.js
import { Worker } from "bullmq";
import redis from "../config/redisClient.js";
import apiClient from "../config/apiClient.js";

export const summaryWorker = new Worker(
  "summaryQueue", 
  async job => {
    const { article } = job.data;

    // Call Hugging Face API
    const response = await apiClient.post("", { inputs: article });
    const summary = response.data[0]?.summary_text || "No summary returned";

    return summary;
  },
  { connection: redis }
);

// listen to worker events for debugging
summaryWorker.on("completed", job => {
  console.log(`✅ Job ${job.id} completed`);
});

summaryWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
