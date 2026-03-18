<div align="center">
  <img src="https://img.icons8.com/nolan/96/map-pin.png" alt="WiseTrek Logo" width="90" />
  
  <h1 align="center">WiseTrek</h1>
  
  <p align="center">
    <strong>Ditch the forms. Kill the tabs. Plan your perfect trip with a single click.</strong>
  </p>
  
  <div align="center">
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Express_5-404D59?style=for-the-badge&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/Gemini_2.5-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" />
    <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" />
    <img src="https://img.shields.io/badge/Upstash_Vector-00E599?style=for-the-badge&logo=upstash&logoColor=white" />
  </div>
</div>

<br />

## 🛑 The Problem
Planning a trip usually means drowning in a sea of browser tabs: one for weather, two for hotels, three for local events, and a messy spreadsheet to hold it all together. Worse, travel apps force you through endless, boring web forms just to get started.

## 🚀 The WiseTrek Solution
**WiseTrek** is an AI-orchestrated travel platform built on a simple philosophy: **Zero friction.** We aggregate everything you need into a single, highly animated dashboard and use conversational AI and RAG architecture to do the heavy lifting.

### ✨ The "Unfair Advantage" Features

* 💬 **Zero Forms. Only Chatbots:** We killed the traditional web form. Our sleek **AuthBot** guides you through secure JWT authentication, or lets you bypass typing entirely with seamless **One-Click Google OAuth**.
* ⚡ **AI or Manual—You Choose:** Give WiseTrek a destination and a date, click once, and our AI instantly generates a mathematically balanced, day-by-day travel plan. Prefer total control? Switch to our **Manual Planner** and use drag-and-drop mechanics to build it yourself.
* 🪄 **Single-Click Modifications:** Plans change. Want to make your trip 20% cheaper or swap a museum for a hike? Type your request and our AI instantly rewrites your route and recalculates your budget in a single click, maintaining strict JSON data structures.
* 📄 **Export to PDF:** Take your plans off-grid. Once your itinerary is perfected, download it as a beautifully formatted, travel-ready PDF with just one click.
* 🧠 **"The Station Master" (RAG AI Agent):** Powered by **LangChain**, **LangGraph**, and **Upstash Vector**, WiseTrek features an embedded domain-expert AI. It searches our custom travel handbook embeddings to give you hyper-personalized advice.
* 🏨 **Smart Hotel Engine:** We query Google Hotels live via **SerpApi** and pipe the results through Gemini to generate dynamic, 2-line AI review summaries for every property.
* 🎯 **The Holy Trinity of Travel:** With a single search, your dashboard dynamically populates with Live Weather, Local Events, and Smart Stays.

---

## 🛠️ Tech Stack & Architecture

This application is built for scale, combining premium UI libraries with an agentic AI backend.

**Frontend (Client)**
- **Core:** React 18, Vite, React Router DOM
- **Styling & UI:** Tailwind CSS v4, Material UI (MUI), Radix UI Primitives
- **Animations & Interactions:** Framer Motion (`motion`), React DnD (Drag & Drop)
- **Utilities:** PDF Export, Recharts, Embla Carousel, Lucide React

**Backend (Server)**
- **Core:** Node.js, Express 5.x
- **Database:** MongoDB & Mongoose
- **Auth:** Passport.js (Google OAuth 2.0), JWT, bcryptjs
- **AI & LLMs:** Google Generative AI (`gemini-2.5-flash`), Tavily (Search)
- **RAG Pipeline:** LangChain Core/Community, `@langchain/textsplitters`, Upstash Vector
- **Data Validation:** Zod

---

## 🚦 Try creating your Itinerary 




 
