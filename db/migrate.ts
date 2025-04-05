import "dotenv/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const runMigrations = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const sql = postgres("postgres://neondb_owner:npg_oMD6QV7Pgatm@ep-super-leaf-a44apuj1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require", { max: 1 });
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