import { sql } from "drizzle-orm";
import { db } from "@db";

export async function dropStartingOdds() {
  await sql`
    -- Only drop starting_odds, keep resolution columns
    ALTER TABLE markets DROP COLUMN IF EXISTS starting_odds;
  `;
} 