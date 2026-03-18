import 'dotenv/config';

export const getTripPlan = async (req, res) => {
  const { destination, category } = req.body;
  const apiKey = process.env.GEMINI_API_KEYY;


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
    console.log(`[GEMINI API CALL] -> getTripPlan (Destination: ${destination})`);
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


export const getStructuredTripPlan = async (req, res) => {
  
  const { 
    destination, 
    dates, 
    travelers, 
    budget, 
    accommodation, 
    transportation, 
    activities 
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEYY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  
  const numericBudget = parseInt(budget.replace(/[^0-9]/g, '')) || 3000;

  const prompt = `
    Act as a precise, expert travel planner. Create a realistic, logical itinerary for ${destination}.
    
    User Preferences:
    - Dates/Duration: ${dates}
    - Travelers: ${travelers}
    - Total Budget: ${budget} (Distribute roughly ${numericBudget} among categories)
    - Accommodation: ${accommodation}
    - Transportation: ${transportation}
    - Interests: ${activities}

    You MUST return ONLY a valid JSON object matching exactly this schema:
    {
      "route": [
        {
          "day": 1,
          "name": "Name of the neighborhood or main attraction",
          "duration": "e.g., 8 hours",
          "distance": "e.g., 5 km"
        }
      ],
      "budget": {
        "totalAmount": ${numericBudget},
        "items": [
          {
            "category": "Name of category",
            "amount": numeric_value,
            "icon": "MUST BE ONE OF: plane, hotel, food, activities, shopping, other",
            "breakdown": [
              { "item": "Specific expense", "cost": numeric_value }
            ]
          }
        ]
      }
    }

    Rules:
    1. Make the number of days in "route" match the implied duration in "${dates}". 
    2. Sum of all budget item amounts MUST equal ${numericBudget}.
    3. Keep breakdowns realistic for ${destination}.
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      
      responseMimeType: "application/json" 
    }
  };

  try {
    console.log(`[GEMINI API CALL] -> getStructuredTripPlan (Destination: ${destination})`);
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
        error: json.error?.message || "AI routing failed." 
      });
    }

    
    const aiResponseText = json.candidates[0].content.parts[0].text;
    const structuredData = JSON.parse(aiResponseText);

    
    res.json({ success: true, data: structuredData });

  } catch (error) {
    console.error("Server Error parsing AI structured output:", error);
    res.status(500).json({ success: false, error: "Failed to generate structured plan." });
  }
};

export const modifyStructuredTripPlan = async (req, res) => {
  const { currentPlan, currentData, userInstruction } = req.body;
  const apiKey = process.env.GEMINI_API_KEYY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
    Act as a precise, expert travel planner. You are modifying an existing itinerary based on a user's request.
    
    Current Trip Context:
    Destination: ${currentData.destination}
    Dates/Duration: ${currentData.dates}
    Original Budget: ${currentData.budget}

    Current Itinerary Data (JSON):
    ${JSON.stringify(currentPlan)}

    User Request for Modification:
    "${userInstruction}"

    Instructions:
    Modify the "Current Itinerary Data" to fulfill the user's request. 
    Keep the exact same JSON schema structure for "route" and "budget".
    Adjust the budget breakdown if the user asked for cheaper/more expensive options, or changed activities.
    Adjust the route if they wanted different pacing, activities, or days.
    
    You MUST return ONLY a valid JSON object matching exactly this schema:
    {
      "route": [ { "day": 1, "name": "...", "duration": "...", "distance": "..." } ],
      "budget": { "totalAmount": 1000, "items": [ { "category": "...", "amount": 100, "icon": "...", "breakdown": [...] } ] }
    }
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  };

  try {
    console.log(`[GEMINI API CALL] -> modifyStructuredTripPlan (Instruction: "${userInstruction}")`);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.error?.message || "AI modification failed.");

    const structuredData = JSON.parse(json.candidates[0].content.parts[0].text);
    res.json({ success: true, data: structuredData });

  } catch (error) {
    console.error("Modification Error:", error);
    res.status(500).json({ success: false, error: "Failed to modify plan." });
  }
};