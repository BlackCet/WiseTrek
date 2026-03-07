import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { Index } from "@upstash/vector";
import { TavilySearch } from "@langchain/tavily"; // Standard 2026 partner package
import { z } from "zod";
import 'dotenv/config';

// 1. Initialize Components
const index = new Index({ 
    url: process.env.UPSTASH_VECTOR_REST_URL, 
    token: process.env.UPSTASH_VECTOR_REST_TOKEN 
});

const model = new ChatGroq({ 
    apiKey: process.env.GROQ_API_KEY, 
    model: "llama-3.3-70b-versatile" 
});

const tavily = new TavilySearch({ 
    apiKey: process.env.TAVILY_API_KEY,
    maxResults: 3 
});

// 2. Define State
// input: user query
// plan: the steps the AI decides to take
// pastSteps: context collected from Vector DB or Web
const AgentState = Annotation.Root({
    input: Annotation(),
    plan: Annotation(),
    pastSteps: Annotation({ 
        reducer: (x, y) => x.concat(y), 
        default: () => [] 
    }),
    response: Annotation(),
});

// 3. Nodes
// Planner: Creates a strategy
const plannerNode = async (state) => {
    const planSchema = z.object({ 
        steps: z.array(z.string()).describe("Steps to research the user request") 
    });
    const structuredModel = model.withStructuredOutput(planSchema);
    
    const res = await structuredModel.invoke([
        ["system", "You are the WiseTrek Station Master. Break the travel query into 2 logical search steps."],
        ["human", state.input]
    ]);
    return { plan: res.steps };
};

// Executor: Performs RAG (Upstash) or Web Search (Tavily)
const executorNode = async (state) => {
    const currentStepIndex = state.pastSteps.length;
    const step = state.plan[currentStepIndex];
    
    console.log(`🚂 Station Master executing step: ${step}`);

    // Attempt 1: Upstash Vector Search (Handbook / PDF Knowledge)
    const results = await index.query({ 
        data: step, 
        topK: 3, 
        includeData: true 
    });
    
    let context = results.map(r => r.data).filter(Boolean).join("\n\n");

    // Attempt 2: Tavily Search (If handbook has no answer, check the live web)
    if (!context || context.trim().length < 10) {
        console.log("📡 Handbook empty for this step. Consulting the telegraph (Web)...");
        const webResults = await tavily.invoke(step);
        context = webResults;
    }

    return { pastSteps: [context || "No information found."] };
};

// Synthesizer: Writes the final "Vintage" response
const synthesizerNode = async (state) => {
    const finalAns = await model.invoke([
        ["system", `You are the WiseTrek Station Master. 
         Your goal is to provide TARGETED, concise information. 
         
         STRICT RULES:
         - Keep responses under 3 sentences unless a detailed list is required.
         - Use vintage charm (Traveler, Platform, Dispatch) but remain brief.
         - Do not repeat the user's question.
         - If the context contains the answer, give it directly.
         - If the answer isn't there, admit it quickly and offer a brief general suggestion.`],
        ["human", `Context: ${state.pastSteps.join("\n\n")} \n\n Question: ${state.input}`]
    ]);
    return { response: finalAns.content };
};
// 4. Define Graph Logic
const shouldContinue = (state) => {
    if (state.pastSteps.length < state.plan.length) {
        return "execute";
    }
    return "synthesize";
};

const workflow = new StateGraph(AgentState)
    .addNode("planner", plannerNode)
    .addNode("executor", executorNode)
    .addNode("synthesize", synthesizerNode)
    .addEdge(START, "planner")
    .addEdge("planner", "executor")
    .addConditionalEdges("executor", shouldContinue, {
        execute: "executor",
        synthesize: "synthesize",
    })
    .addEdge("synthesize", END);

export const travelAgent = workflow.compile();