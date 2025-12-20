// controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getTripPlan = async (req, res) => {
  const { destination, category } = req.body;

  try {
    // 1. Select the model (Gemini 1.5 Flash is fastest/cheapest)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Construct the Prompt
    const prompt = `
     I am a traveler visiting ${destination}. 
      My specific interest is: ${category || "General Sightseeing"}.
      
      Act as a sweet, nostalgic, and detail-oriented travel guide from the local place.
    Create a 1-day itinerary that is rich in detail and storytelling.

      **CONTENT RULES:**
      1. **The 80/20 Rule:** - The Morning and Afternoon activities (80%) MUST be strictly focused on my interest: "${category}".
         - The Evening activity (20%) should be a surprise "Wildcard" recommendation from you—something unique I wouldn't expect.
      2. **Tone:** Warm, nostalgic, and descriptive. Make me feel like I am stepping back in time.
      3. **Formatting:** Use bullet points for readability, but you are free to write 15-20 words per point to fully describe the atmosphere.

      **Structure the response exactly like this:**
      
      ### 🎩 A Vintage Day in ${destination}
      
      **🌅 Morning: [Activity Name based on ${category}]**
      * [Describe the sights, smells, and why this specific spot is perfect for a lover of ${category}. Paint a picture.]
      * **Breakfast:** [Specific recommendation for a classic or historic eatery].
      
      **☀️ Afternoon: [Activity Name based on ${category}]**
      * [A deep dive into the culture of ${category} here. What should I look for? What details might I miss?]
      * **Lunch:** [A spot that locals have loved for decades].
      
      **🌙 Evening: [The Wildcard Suggestion!]**
      * [Surprise me! Pick a hidden gem, a jazz club, or a quiet view that has nothing to do with ${category} but captures the soul of the city.]
      
      **💡 Vintage Tip:** [A practical secret or etiquette tip for the modern traveler].
    `;

    // 3. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Send back to Frontend
    res.json({ success: true, answer: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: "AI is tired right now." });
  }
};