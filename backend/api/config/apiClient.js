import axios from "axios";

const apiClient = axios.create({
  // baseURL: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
  baseURL: process.env.NEW_HF_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
  },
});

export default apiClient;
