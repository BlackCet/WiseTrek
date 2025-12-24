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
     Act as an expert local travel planner for ${destination}. 
Create a strictly focused 1-day itinerary for a traveler interested in: "${category || "General Sightseeing"}".

**PLANNING CONSTRAINTS:**
1. **The 80/20 Rule:**
   - **Morning & Afternoon (80%):** Must be strictly curated around "${category}". Select locations that are high-quality and relevant.
   - **Evening (20%):** Provide a "Local Wildcard"—a hidden gem or unique experience (e.g., a rooftop view, a quiet alleyway, or a local haunt) that is unrelated to the primary category.
2. **Logistics:** Ensure the locations are geographically sensible to minimize travel time between stops.
3. **Tone:** Insightful, practical, and authoritative. Avoid excessive fluff; focus on actionable details.

**RESPONSE FORMAT (Follow this exactly):**

### 📍 One Day in ${destination}

**🌅 Morning: ${category} Exploration**
* **Primary Activity:** [Name of Location/Activity] - [Briefly explain the significance and what to focus on here].
* **Breakfast:** [Name of Eatery] - [Recommendation for a specific dish or the historic value of the place].

**☀️ Afternoon: ${category} Deep Dive**
* **Primary Activity:** [Name of Location/Activity] - [Provide a specific cultural or technical detail the average tourist misses].
* **Lunch:** [Name of Eatery] - [A legendary local spot known for quality and authenticity].

**🌙 Evening: The Local Wildcard**
* **Hidden Gem:** [Specific Activity Name] - [Explain why this captures the true soul of the city away from the main interest].

**💡 Pro Tip:** [A specific logistical secret, local etiquette, or timing tip to save the traveler time or money].
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