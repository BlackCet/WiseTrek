import express from 'express';
import { getJson } from 'serpapi'; 

const router = express.Router();


router.get('/search-events', async (req, res) => {
  const { destination, category } = req.query;

  try {
    
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

  
    const response = await getJson(searchOptions);
    
    
    if (!response.events_results || response.events_results.length === 0) {
        console.log("⚠️ No events found.");
        console.log("Debug URL:", response.search_metadata?.google_url);
        return res.json([]); 
    }

    
    res.json(response.events_results);
    
  } catch (error) {
    console.error("SerpApi Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router; 