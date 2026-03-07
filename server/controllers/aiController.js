import 'dotenv/config';

export const getTripPlan = async (req, res) => {
  const { destination, category } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Exact URL from your directTest.js
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
    Act as an expert local travel planner for ${destination}. 
    Requirements: ${category}
    
    Create a day-by-day itinerary. 
    Constraint: 80% focuses on interests, 20% is a "Local Wildcard" hidden gem for the evening.

    RESPONSE FORMAT:
    ### 📍 Day [X]: [Theme]
    **🌅 Morning: Exploration**
    * **Primary Activity:** [Name] - [Significance].
    * **Breakfast:** [Eatery] - [Recommendation].

    **☀️ Afternoon: Deep Dive**
    * **Primary Activity:** [Name] - [Unique detail].
    * **Lunch:** [Eatery] - [Local legend].

    **🌙 Evening: The Local Wildcard**
    * **Hidden Gem:** [Name] - [Soul of city].

    **💡 Pro Tip:** [Logistics].
    ---
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", json);
      return res.status(response.status).json({ 
        success: false, 
        error: json.error?.message || "AI is currently unavailable." 
      });
    }

    const aiResponse = json.candidates[0].content.parts[0].text;
    res.json({ success: true, answer: aiResponse });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};