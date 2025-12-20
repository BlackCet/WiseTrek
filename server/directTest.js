// directTest.js
require('dotenv').config();

async function rawTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // We will test the standard "gemini-pro" model directly
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const data = {
    contents: [{ parts: [{ text: "Hello, are you working?" }] }]
  };

  try {
    console.log(`📡 Sending raw request to Google...`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await response.json();

    if (!response.ok) {
      console.log("\n❌ RAW ERROR DETAILS:");
      console.log("------------------------------------------------");
      console.log(JSON.stringify(json, null, 2)); // This prints the REAL reason
      console.log("------------------------------------------------");
    } else {
      console.log("\n✅ SUCCESS!");
      console.log(json.candidates[0].content.parts[0].text);
    }

  } catch (error) {
    console.error("Network Error:", error);
  }
}

rawTest();