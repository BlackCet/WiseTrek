import express from 'express';
import { getJson } from 'serpapi'; 

const router = express.Router();

router.get('/search-events', async (req, res) => {
  const { destination, category } = req.query;

  try {
    const baseTerm = category ? category : "Events";
    const robustQuery = `${baseTerm} in ${destination}, India`;

    const searchOptions = {
      engine: "google",
      q: robustQuery, 
     
      location: "India", 
      api_key: process.env.SERP_API_KEY, 
      gl: "in",
      hl: "en"
    };

    console.log("Searching with optimized options:", { 
        q: searchOptions.q,
        location: searchOptions.location
    });

    const response = await getJson(searchOptions);

    if (!response.events_results || response.events_results.length === 0) {
        console.log("⚠️ No events found in rich snippet.");
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