// testGemini.js
require('dotenv').config(); // Load your .env file
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAI() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is missing from .env file!");
    return;
  }

  try {
    console.log("🤖 Connecting to Gemini...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Say 'Hello WiseTrek!' and give me one random fun fact about travel.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n✅ Success! AI Response:");
    console.log("-----------------------------");
    console.log(text);
    console.log("-----------------------------");

  } catch (error) {
    console.error("\n❌ Test Failed:", error.message);
  }
}

testAI();