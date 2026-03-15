# WiseTrek: System Architecture & Feature Reference

## 1. Core Identity & Purpose
WiseTrek is a unified, AI-powered travel planning application built on the MERN stack. It eliminates the friction of trip planning by aggregating live hotel data, local events, real-time weather forecasts, and AI-generated custom itineraries into a single, sleek, glassmorphic user interface.

## 2. Technical Stack
* **Frontend:** React (Vite), Tailwind CSS v4, Material UI (MUI), React Router DOM, Lucide React (Icons). Typography powered by Nunito.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose), Upstash (Vector/RAG capabilities).
* **Authentication:** Custom JWT (JSON Web Token) implementation with Context API global state management (`AuthContext`) and Protected Routes to block unauthenticated access.
* **AI Engine:** Google Gemini API (specifically `gemini-2.5-flash` model).

## 3. Key Modules & Features

### 3.1. Smart Search & Dashboard (`HomePage`)
* Users input a Destination, Start Date, End Date, and primary Interest (Music, Sports, Food, or All).
* The dashboard aggregates three primary data streams:
  1. **Weather:** Live forecasting for the selected city.
  2. **Events:** Local happenings filtered by the user's selected interest and dates, mapped with custom category emojis and statistics.
  3. **Hotels:** Live accommodations fetched dynamically.

### 3.2. Hotel Recommendation Engine
* **Data Source:** SerpAPI (Google Hotels engine).
* **Processing:** Filters results locally based on user budget inputs ("budget", "mid", "premium"). Max price heuristic: Budget <= ₹2500, Mid <= ₹4000, Premium <= ₹8000.
* **AI Enrichment:** Each hotel card is dynamically enriched by Gemini 2.5 Flash, reading up to 3 live Google review snippets to generate a realistic, 1-2 line summary of the guest experience.

### 3.3. Itinerary Generation (AI & Manual)
* **Access:** Locked behind JWT authentication (`ProtectedRoute`). Unauthenticated users attempting to access these routes trigger the `AuthBot` login modal via React Router state flags.
* **AI Planner:** Uses Gemini 2.5 Flash instructed to act as an expert local travel planner. 
* **Data Schema:** The AI strictly outputs a structured JSON object containing:
  * `route`: An array of daily activities, durations, and distances.
  * `budget`: A mathematical breakdown of the total budget distributed across categories (food, hotel, activities, etc.), ensuring the sum equals the user's exact total budget.
* **Modification:** Users can submit natural language instructions to modify existing plans (e.g., "make it cheaper", "add more museums"), which the AI processes while maintaining the strict JSON schema.

## 4. UI/UX Philosophy
* **Design Language:** Modern, minimal, and premium. Utilizes glassmorphism (`backdrop-blur`), soft custom gradients (blue-to-purple-to-pink), and clean floating inputs.
* **Interactions:** Emphasizes micro-interactions, such as `group-hover` effects on search inputs, physical button compressions (`active:scale-[0.98]`), and seamless SPA routing without hard page reloads after OAuth success.

## 5. Third-Party Integrations
* Google Gemini API (`generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`)
* SerpAPI (`https://serpapi.com/search.json`) for Google Hotels.
* Custom Weather API microservice.
* Custom Event API microservice.