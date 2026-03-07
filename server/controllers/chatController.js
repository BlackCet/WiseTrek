import { travelAgent } from '../services/ragService.js';

export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        // Invoke your LangGraph Agent
        const result = await travelAgent.invoke({ input: message });
        
        res.json({ 
            success: true, 
            answer: result.response 
        });
    } catch (error) {
        console.error("RAG Error:", error);
        res.status(500).json({ error: "The Station Master is busy." });
    }
};