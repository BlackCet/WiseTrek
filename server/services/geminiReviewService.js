const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateHotelReview = async (hotel) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Generate a short, realistic hotel review (1-2 lines):

Hotel Name: ${hotel.name}
Rating: ${hotel.rating}
Location: ${hotel.address || "City center"}
Price per night: ${hotel.pricePerNight}

Do not mention Google or sources.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini review error:", err.message);
    return "Guests appreciate the comfortable stay and convenient location.";
  }
};

module.exports = { generateHotelReview };
