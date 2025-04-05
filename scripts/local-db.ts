import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const localUrl = "postgresql://trevorgillan@localhost:5432/my_database";
const client = postgres(localUrl);
export const db = drizzle(client, { schema }); 