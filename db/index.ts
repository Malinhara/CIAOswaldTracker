import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema.ts";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const connectionString = "postgres://neondb_owner:npg_oMD6QV7Pgatm@ep-super-leaf-a44apuj1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Create postgres client with native pg driver
const client = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: true
  },
  max: 1
});

// Create and export the db instance
export const db = drizzle(client, { schema });

// Test connection
async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await client`SELECT NOW()`;
    console.log('✅ Connected to database:', result[0].now);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
}

// Export the test function
export { testConnection };

