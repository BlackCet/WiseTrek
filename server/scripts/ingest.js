import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Index } from "@upstash/vector";
import 'dotenv/config';
import path from 'path';

// 1. Initialize Upstash
const index = new Index({ 
  url: process.env.UPSTASH_VECTOR_REST_URL, 
  token: process.env.UPSTASH_VECTOR_REST_TOKEN 
});

/**
 * Ingests travel documents into the WiseTrek Vector Store
 * @param {string} fileName - The name of the file in the /docs folder
 */
async function ingestTravelDoc(fileName) {
  try {
    const filePath = path.resolve('docs', fileName);
    console.log(`🚂 Station Master is reading: ${fileName}...`);

    // 2. Load the Document
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    // 3. Split into manageable "Context Chunks"
    // 1000 characters with a 200-char overlap ensures 
    // that the AI gets enough surrounding context.
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitDocuments(docs);
    console.log(`📑 Split into ${chunks.length} memory fragments.`);

    // 4. Batch Upload to Upstash
    // Upstash Free Tier prefers smaller batches
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize).map((chunk, idx) => ({
        id: `wisetrek-${fileName}-${i + idx}`,
        data: chunk.pageContent,
        metadata: { 
          source: fileName, 
          page: chunk.metadata.loc?.pageNumber || "General Guide",
          type: "Travel Knowledge"
        }
      }));

      await index.upsert(batch);
      console.log(`✅ Uploaded fragments ${i} to ${Math.min(i + batchSize, chunks.length)}`);
    }

    console.log(`\n🎉 Success! ${fileName} is now part of WiseTrek's intelligence.`);
  } catch (error) {
    console.error("❌ Ingestion Failed:", error.message);
  }
}

// EXECUTION: List your travel documents here
const docsToIngest = ["wisetrek_handbook.pdf"];

(async () => {
    for (const doc of docsToIngest) {
        await ingestTravelDoc(doc);
    }
})();