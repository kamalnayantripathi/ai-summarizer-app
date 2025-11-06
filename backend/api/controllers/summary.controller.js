import { Summary } from "../models/summary.model.js";
import redis from "../config/redisClient.js";
import crypto from "crypto"
import { summaryQueue } from "../queues/summaryQueue.js";
import { Queue, QueueEvents, Worker, Job } from "bullmq";


const createSummary = async (req, res) => {
  try {
    const { article } = req.body;
    if (!article) return res.status(400).json({ message: "Article is required." });
    console.log("article enqueuing for summarization: ", article)
    // Cache key logic
    const cacheKey = `summary:${crypto.createHash("sha256").update(article).digest("hex")}`;
    const cachedSummary = await redis.get(cacheKey);
    if (cachedSummary) {
      return res.status(200).json({
        statusCode: 200,
        summary: JSON.parse(cachedSummary),
        message: "Summary served from cache",
      });
    }

    // Add job to BullMQ queue
    const job = await summaryQueue.add("generate-summary", { article });

    // Create QueueEvents for waitUntilFinished
    const queueEvents = new QueueEvents("summaryQueue", { connection: redis });
    await queueEvents.waitUntilReady(); // make sure events are ready

    const summary = await job.waitUntilFinished(queueEvents);

    // Cache result
    await redis.set(cacheKey, JSON.stringify(summary), "EX", 21600);
    console.log("article cached successfully.")
    return res.status(200).json({
      statusCode: 200,
      summary,
      message: "Summary generated successfully",
    });
  } catch (error) {
    console.error("Error creating summary:", error);
    return res.status(500).json({ message: error.message });
  }
};


const saveSummary = async(req, res) => {
    try {
        const {article, summaryText } = req.body;
        if(!article || !summaryText) return res.status(404).json({ message: "All fields are required."})
        const username = req.user.name;
        const userId = req.user.id;
        console.log("saving summary for user: ",username, userId)
        const summary = await Summary.create({
            article,
            summaryText,
            createdBy: username,
            userId,
        })
        console.log("summary saved successfully.")
        return res.status(200).json({
            statusCode: 200,
            summary,
            message: "Summary created successfully."
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getSummaries = async(req, res) => {
    try {
        const cacheKey = "summaries:all"
        // Try to get redis data
        const cachedData = await redis.get(cacheKey)
        if(cachedData){
            console.log("Serving summaries from cache");
            return res.status(200).json({
                statusCode: 200,
                summaries: JSON.parse(cachedData),
                message: "Summaries fetched from redis successfully."
            })
        }
        // Fetch data from db if not in cache
        const summaries = await Summary.find();
        if(!summaries.length){ 
            return res.status(200).json({ 
                statusCode: 200,
                summaries: [],
                message: "No summaries right now."
            });
        }

        // Cache data in redis
        await redis.set(cacheKey, JSON.stringify(summaries), "EX", 60)
        console.log("Summaries cached in redis.")

        return res.status(200).json({
            statusCode: 200,
            summaries,
            message: "Summaries fetched successfully."
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getSummary = async(req, res) => {
    try {
        const summaryId = req.params.id;
        const summary = await Summary.findById(summaryId);
        if(!summary) return res.status(401).json({ message: "Summary not found."});
        return res.status(200).json({
            statusCode: 200,
            summary,
            message: "Summary fetched successfully."
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const updateSummary = async(req, res) => {
    try {
        const summaryId = req.params.id;
        const { summaryText, article } = req.body;
        const summary = await Summary.findById(summaryId)
        if(!summary) return res.status(401).json({ message: "Summary not found."});
        summary.summaryText = summaryText;
        summary.article = article;
        await summary.save();
        return res.status(200).json({
            statusCode: 200,
            summary,
            message: "Summary updated successfully."
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const deleteSummary = async(req, res) => {
    try {
        const summaryId = req.params.id;
        const deletedSummary = await Summary.findByIdAndDelete(summaryId)
        if(!deletedSummary) return res.status(401).json({ message: "Couldn't delete summary."})

        await redis.del("summaries:all")
        console.log("Cleared Redis cache for summaries:all.")

        return res.status(200).json({
            statusCode: 200,
            deletedSummary,
            message: "Summary deleted successfully."
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export {
    createSummary,
    saveSummary,
    getSummary,
    getSummaries,
    updateSummary,
    deleteSummary
}