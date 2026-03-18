import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Index } from "@upstash/vector";
import 'dotenv/config';
import path from 'path';

const index = new Index({ 
  url: process.env.UPSTASH_VECTOR_REST_URL, 
  token: process.env.UPSTASH_VECTOR_REST_TOKEN 
});

/**
 * Ingests travel documents into the WiseTrek Vector Store
 * @param {string} fileName 
 */
async function ingestTravelDoc(fileName) {
  try {
    const filePath = path.resolve('docs', fileName);
    console.log(`🚂 Station Master is reading: ${fileName}...`);


    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

   
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitDocuments(docs);
    console.log(`📑 Split into ${chunks.length} memory fragments.`);

    
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

const docsToIngest = ["wisetrek_handbook3.pdf"];

(async () => {
    for (const doc of docsToIngest) {
        await ingestTravelDoc(doc);
    }
})();