// listModels.js
require('dotenv').config();

async function listMyModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log("📡 Fetching your available models...");
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ SUCCESS! Here are the models you can use:");
      console.log("---------------------------------------------");
      // Filter for only 'generateContent' models (chat models)
      const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
      
      chatModels.forEach(m => {
        console.log(`Name: ${m.name}`); // This is the EXACT string we need
        console.log(`Desc: ${m.description.substring(0, 60)}...`);
        console.log("---");
      });
    } else {
      console.log("\n❌ No models found. This API key has zero permissions.");
      console.log("Full Response:", data);
    }

  } catch (error) {
    console.error("Network Error:", error);
  }
}

listMyModels();