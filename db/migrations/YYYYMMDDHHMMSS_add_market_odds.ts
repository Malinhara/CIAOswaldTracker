import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export async function up(db: PostgresJsDatabase) {
  await db.execute(sql`
    ALTER TABLE markets
    ADD COLUMN current_odds NUMERIC NOT NULL DEFAULT 0.5,
    ADD COLUMN yes_amount NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN no_amount NUMERIC NOT NULL DEFAULT 0;
  `);

  // Change total_liquidity from decimal to numeric
  await db.execute(sql`
    ALTER TABLE markets
    ALTER COLUMN total_liquidity TYPE NUMERIC;
  `);
}

export async function down(db: PostgresJsDatabase) {
  await db.execute(sql`
    ALTER TABLE markets
    DROP COLUMN current_odds,
    DROP COLUMN yes_amount,
    DROP COLUMN no_amount;
  `);

  await db.execute(sql`
    ALTER TABLE markets
    ALTER COLUMN total_liquidity TYPE DECIMAL;
  `);
} 