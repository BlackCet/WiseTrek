import 'dotenv/config';

export const generateHotelReview = async (hotel) => {
  // Make sure this matches the exact spelling in your .env file
  const apiKey = process.env.GEMINI_API_KEYY; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
Generate a short, realistic hotel review (1-2 lines):

Hotel Name: ${hotel.name}
Rating: ${hotel.rating}
Location: ${hotel.address || "City center"}
Price per night: ${hotel.pricePerNight}

Do not mention Google or sources.
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
      console.error("Gemini API Error generating hotel review:", json);
      // Fallback text if the AI fails so the UI doesn't break
      return "Guests appreciate the comfortable stay and convenient location.";
    }

    const aiResponseText = json.candidates[0].content.parts[0].text;
    return aiResponseText;

  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    return "Guests appreciate the comfortable stay and convenient location.";
  }
};