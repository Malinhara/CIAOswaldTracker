import { db as localDb } from './local-db';
import { db as neonDb } from './neon-db';
import { markets, predictions, evidence, votes, marketOddsHistory } from '../db/schema';

async function migrateData() {
  try {
    console.log('Starting data migration...');

    // Migrate markets
    const localMarkets = await localDb.query.markets.findMany();
    console.log(`Found ${localMarkets.length} markets to migrate`);
    for (const market of localMarkets) {
      await neonDb.insert(markets).values(market);
    }

    // Migrate predictions
    const localPredictions = await localDb.query.predictions.findMany();
    console.log(`Found ${localPredictions.length} predictions to migrate`);
    for (const prediction of localPredictions) {
      await neonDb.insert(predictions).values(prediction);
    }

    // Migrate evidence
    const localEvidence = await localDb.query.evidence.findMany();
    console.log(`Found ${localEvidence.length} evidence items to migrate`);
    for (const item of localEvidence) {
      await neonDb.insert(evidence).values(item);
    }

    // Migrate votes
    const localVotes = await localDb.query.votes.findMany();
    console.log(`Found ${localVotes.length} votes to migrate`);
    for (const vote of localVotes) {
      await neonDb.insert(votes).values(vote);
    }

    // Migrate market odds history
    const localHistory = await localDb.query.marketOddsHistory.findMany();
    console.log(`Found ${localHistory.length} history records to migrate`);
    for (const record of localHistory) {
      await neonDb.insert(marketOddsHistory).values(record);
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData(); 