import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import "dotenv/config";

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  console.log('Running migrations...');
  
  await sql`CREATE SCHEMA IF NOT EXISTS public`;
  
  await sql`SET search_path TO public`;

  await migrate(db, { migrationsFolder: "db/migrations" });
  
  console.log('Migrations complete!');
  
  await sql.end();
};

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 