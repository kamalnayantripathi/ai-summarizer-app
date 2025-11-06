import { Queue } from "bullmq";
import redis from "../config/redisClient.js";

export const summaryQueue = new Queue("summaryQueue", { connection: redis });
