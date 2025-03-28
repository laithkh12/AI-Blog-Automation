"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateContentAi(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const cleanResponse = text.trim().replace(/^```json|```$/g, "");
  const parsedResponse = JSON.parse(cleanResponse);

  console.log("generateCategoriesAi", parsedResponse);
  return parsedResponse;
}
