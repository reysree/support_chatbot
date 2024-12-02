import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

pc.listIndexes();
