import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChromaClient } from 'chromadb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    console.log("Connecting to ChromaDB...");
    const client = new ChromaClient({ path: "http://localhost:8000" });
    
    // Create or get the legal dataset collection
    const collection = await client.getOrCreateCollection({ name: "legal_dataset" });
    
    const datasetPath = path.join(__dirname, '..', '..', 'client', 'public', 'legalDataset.json');
    const data = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
    
    const ids = [];
    const documents = [];
    const metadatas = [];
    
    data.questions.forEach((q, index) => {
        ids.push(`q_${index}`);
        documents.push(q.question); // We use the question as the embedding document
        metadatas.push({
            answer: q.answer,
            laws: q.laws ? JSON.stringify(q.laws) : "[]",
            scenarios: q.scenarios ? JSON.stringify(q.scenarios) : "[]"
        });
    });
    
    console.log(`Adding ${ids.length} items to ChromaDB...`);
    
    // Add documents to collection. 
    // It will automatically use the default embedding function to generate vectors.
    await collection.add({
        ids: ids,
        documents: documents,
        metadatas: metadatas
    });
    
    console.log("✅ Successfully ingested into ChromaDB.");
}

run().catch(console.error);
