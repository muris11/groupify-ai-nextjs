import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY || "";

if (!apiKey) {
  throw new Error("Missing Google Gemini API key");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using gemini-1.5-pro-latest - latest stable model
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});

export default genAI;
