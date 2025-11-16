import { PrismaClient } from "../prisma/generated/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as path from 'path'; // Explicitly import path module
import * as dotenv from 'dotenv'; // Explicitly import dotenv module
import { fileURLToPath } from 'url'; // Added for ES Module __dirname equivalent

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Load root .env explicitly

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables. Please check your root .env file.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string // Use process.env, cast to string
});

const prismaClientSingleton = ()=>{
  return new PrismaClient({
    adapter: adapter,
  });
}
declare const globalThis:{
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prismaClient = globalThis.prismaGlobal || prismaClientSingleton();

 if(process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prismaClient