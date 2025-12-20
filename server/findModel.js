// findModel.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CANDIDATE_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-pro", 
  "gemini-1.0-pro",
  "gemini-pro"
];

async function testAllModels() {
  console.log("🕵️  Testing which Gemini model works for you...\n");

  for (const modelName of CANDIDATE_MODELS) {
    process.stdout.write(`👉 Trying '${modelName}'... `);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hi");
      const response = await result.response;
      
      console.log("✅ WORKS!");
      console.log(`\n🎉 SUCCESS! Please update your aiController.js to use: "${modelName}"`);
      return; // Stop after finding the first working one
    } catch (error) {
      if (error.message.includes("404")) {
        console.log("❌ Not Found (404)");
      } else {
        console.log(`❌ Error: ${error.message.split(' ')[0]}...`);
      }
    }
  }

  console.log("\n⚠️ No models worked. Check if your API Key is valid and enabled in Google AI Studio.");
}

testAllModels();