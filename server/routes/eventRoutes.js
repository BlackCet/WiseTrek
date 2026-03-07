import express from 'express';
import { getJson } from 'serpapi'; // Modern import

const router = express.Router();

// --- Main Search Route ---
router.get('/search-events', async (req, res) => {
  const { destination, category } = req.query;

  try {
    // 1. Construct the base query
    const queryTerm = category ? category : "events";
    const fullQuery = `${queryTerm} in ${destination}`;

    const searchOptions = {
      engine: "google_events",
      q: fullQuery,
      api_key: process.env.SERP_API_KEY, 
      gl: "in",
      hl: "en"
    };

    console.log("Searching with options (No Date Filters):", { 
        q: searchOptions.q 
    });

    // 2. Execute Search
    const response = await getJson(searchOptions);
    
    // 3. Debugging & Error Handling
    if (!response.events_results || response.events_results.length === 0) {
        console.log("⚠️ No events found.");
        console.log("Debug URL:", response.search_metadata?.google_url);
        return res.json([]); 
    }

    // 4. Send all top results back to frontend
    res.json(response.events_results);
    
  } catch (error) {
    console.error("SerpApi Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router; // Modern export