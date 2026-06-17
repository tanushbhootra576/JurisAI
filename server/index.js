// index.js (ESM)
import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path, { dirname } from 'path';
import { ChromaClient } from 'chromadb';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

import User from './models/ourmap.js';
import authRoutes from './routes/auth.route.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // Restrict in production
app.use(express.json({ limit: '10kb' })); // Prevent large payload DoS attacks

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', apiLimiter);
// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jurisai';
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const chromaClient = new ChromaClient({ path: "http://localhost:8000" });
let legalCollection = null;

async function initChroma() {
    try {
        legalCollection = await chromaClient.getOrCreateCollection({ name: "legal_dataset" });
        console.log('✅ Connected to ChromaDB collection "legal_dataset"');
    } catch (error) {
        console.error('❌ Failed to connect to ChromaDB:', error.message);
    }
}
initChroma();


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use('/api', authRoutes);
  

import { protect } from './utils/auth.js';

// Chatbot API endpoint
app.post('/api/chatbot', protect, async (req, res) => {
    const { message } = req.body;

    if (!legalCollection) {
        return res.status(500).json({ error: "Chatbot is not ready yet or ChromaDB is not running." });
    }

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Invalid message format." });
    }

    try {
        const results = await legalCollection.query({
            queryTexts: [message],
            nResults: 2 // get top 2 documents for better context
        });

        if (!results.documents || results.documents.length === 0 || results.documents[0].length === 0) {
            return res.json({ response: "Sorry, I couldn't find any relevant legal information regarding your question." });
        }

        // Combine metadata contexts
        let combinedContext = "";
        let sourcesData = [];
        for (let i = 0; i < results.metadatas[0].length; i++) {
            const meta = results.metadatas[0][i];
            const doc = results.documents[0][i];
            
            const laws = JSON.parse(meta.laws || "[]");
            const scenarios = JSON.parse(meta.scenarios || "[]");

            sourcesData.push({
                answer: meta.answer,
                laws: laws,
                scenarios: scenarios,
            });

            combinedContext += `--- Document ${i+1} ---\n`;
            combinedContext += `Legal Info: ${meta.answer}\n`;
            if (laws.length) combinedContext += `Relevant Laws: ${laws.join(", ")}\n`;
            if (scenarios.length) combinedContext += `Example Scenarios: ${scenarios.join(" | ")}\n`;
            combinedContext += `Source Document snippet: ${doc}\n\n`;
        }

        // Ask Gemini to generate the reply
        const prompt = `You are JurisBot, a highly intelligent and helpful legal assistant.
        A user has asked the following legal question:
        "${message}"
        
        Use ONLY the following retrieved legal information to formulate a clear, conversational, and helpful response. If the retrieved context doesn't fully answer the question, state that clearly but provide whatever relevant info is there. Format your response nicely using markdown (bullet points, bold text for laws, etc.).
        
        Retrieved Legal Information:
        ${combinedContext}
        
        Please provide the user with the best possible answer:`;

        try {
            const aiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            // Parse Markdown into HTML using Marked
            // marked.parse can be sync or async, starting from marked v4 it's mostly sync.
            const htmlReply = await marked.parse(aiResponse.text);
            
            res.json({ response: htmlReply, sources: sourcesData });
        } catch (aiError) {
            console.error("Gemini AI error:", aiError);
            res.status(500).json({ error: "Failed to generate AI response. Make sure GEMINI_API_KEY is configured." });
        }
    } catch (error) {
        console.error("❌ ChromaDB query error:", error);
        res.status(500).json({ error: "Failed to process the request with ChromaDB." });
    }
});


// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the Express API!');
});

// Example of a simple user route
// const PORT = process.env.PORT || 5000;?
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Export the app for serverless/Vercel and local bootstrap in dev.js
// export default app;
console.log('App reloaded to connect to ChromaDB...');