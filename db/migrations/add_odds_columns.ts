import { sql } from "drizzle-orm";
import { db } from "@db";

// Add new columns
const addOddsColumns = async () => {
  await sql`
    ALTER TABLE markets 
    ADD COLUMN yes_odds DECIMAL DEFAULT 0.5 NOT NULL,
    ADD COLUMN no_odds DECIMAL DEFAULT 0.5 NOT NULL
  `;
};

addOddsColumns(); 