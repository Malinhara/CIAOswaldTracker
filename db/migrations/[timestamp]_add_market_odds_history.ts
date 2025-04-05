import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { markets } from "../schema";
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export const marketOddsHistory = pgTable("market_odds_history", {
  id: serial("id").primaryKey(),
  marketId: integer("market_id").references(() => markets.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  yesOdds: numeric("yes_odds").notNull(),
  noOdds: numeric("no_odds").notNull(),
  yesAmount: numeric("yes_amount").notNull(),
  noAmount: numeric("no_amount").notNull(),
  totalLiquidity: numeric("total_liquidity").notNull(),
});

export async function up(db: PostgresJsDatabase) {
  await db.execute(sql`
    CREATE TABLE market_odds_history (
      id SERIAL PRIMARY KEY,
      market_id INTEGER NOT NULL REFERENCES markets(id),
      timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
      yes_odds NUMERIC NOT NULL,
      no_odds NUMERIC NOT NULL,
      yes_amount NUMERIC NOT NULL,
      no_amount NUMERIC NOT NULL,
      total_liquidity NUMERIC NOT NULL
    );
  `);
}

export async function down(db: PostgresJsDatabase) {
  await db.execute(sql`DROP TABLE IF EXISTS market_odds_history;`);
} 