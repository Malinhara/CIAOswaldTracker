import { asc, desc, eq, isNull, sql } from "drizzle-orm";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "../db/index.ts";
import { evidence, marketOddsHistory, markets, predictions, users, votes } from "../db/schema.ts";
import { calculateMarketOdds } from '../shared/utils';
import { setupAuth } from "./auth";

console.log('Do we get we get routes');

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  console.log('Are we inside registerRoutes');

  // Add a heartbeat route to verify server is running
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // New endpoint to clear evidence for a specific market
  app.post("/api/markets/:id/clear-evidence", async (req, res) => {
    try {
      const marketId = parseInt(req.params.id);

      // Verify the market exists
      const market = await db.query.markets.findFirst({
        where: eq(markets.id, marketId),
      });

      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }

      // Soft delete by updating evidence entries to be marked as cleared
      await db
        .update(evidence)
        .set({
          content: "[Cleared]",
          text: "[Cleared]",
        })
        .where(eq(evidence.marketId, marketId));

      res.json({ message: "Evidence cleared successfully" });
    } catch (error) {
      console.error('Error clearing evidence:', error);
      res.status(500).json({ error: 'Failed to clear evidence' });
    }
  });

  // Delete all evidence with null marketId
  app.delete("/api/evidence/cleanup", async (req, res) => {
    try {
      // Delete evidence with null marketId
      await db
        .delete(evidence)
        .where(isNull(evidence.marketId));

      res.json({ message: "Successfully deleted all evidence without market ID" });
    } catch (error) {
      console.error('Error deleting evidence:', error);
      res.status(500).json({ error: 'Failed to delete evidence' });
    }
  });

  // Get specific market
  app.get("/api/markets/:id", async (req, res) => {
    try {
      const marketId = parseInt(req.params.id);
      console.log('Fetching market:', marketId); // Debug log
      
      const market = await db.query.markets.findFirst({
        where: eq(markets.id, marketId),
      });

      if (!market) {
        console.log('Market not found:', marketId); // Debug log
        return res.status(404).json({ 
          error: "Market not found",
          requestedId: marketId 
        });
      }

      console.log('Found market:', market); // Debug log
      res.json(market);
    } catch (error) {
      console.error('Error fetching market:', error);
      res.status(500).json({ 
        error: "Failed to fetch market",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get all markets
  app.get("/api/markets", async (req, res) => {
    try {
      console.log('🎯 API: /api/markets endpoint hit');
      console.log('🔌 Database URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');
      
      const allMarkets = await db.query.markets.findMany({
        orderBy: desc(markets.createdAt),
        with: {
          predictions: true,
        },
      });
      
      console.log('📊 Found markets:', allMarkets.length);
      res.json(allMarkets);
    } catch (error) {
      console.error('❌ Error in /api/markets:', error);
      res.status(500).json({ error: 'Failed to fetch markets' });
    }
  });

  // Submit evidence endpoint
  app.post("/api/evidence", async (req, res) => {
    try {
      const { title, content, text, marketId, evidenceType } = req.body;

      if (!title || !content) {
        return res.status(400).send("Title and content are required");
      }

      // Ensure marketId is properly parsed as an integer if provided
      const parsedMarketId = marketId ? parseInt(marketId) : null;

      console.log('Creating evidence with:', {
        title,
        content,
        text,
        marketId: parsedMarketId,
        evidenceType
      });

      // Create the new evidence
      const [newEvidence] = await db
        .insert(evidence)
        .values({
          userId: 1, // Default user for now
          marketId: parsedMarketId,
          title,
          content,
          text: text || null,
          evidenceType: evidenceType || 'yes',
        })
        .returning();

      console.log('Created evidence:', newEvidence);

      // Return the new evidence with its relationships
      const evidenceWithRelations = await db.query.evidence.findFirst({
        where: eq(evidence.id, newEvidence.id),
        with: {
          votes: true,
          user: true,
        },
      });

      console.log('Returning evidence with relations:', evidenceWithRelations);
      res.json(evidenceWithRelations);
    } catch (error) {
      console.error('Error submitting evidence:', error);
      res.status(500).json({ error: 'Failed to submit evidence' });
    }
  });

  // Evidence routes
  app.get("/api/evidence", async (req, res) => {
    try {
      const marketId = req.query.marketId ? parseInt(req.query.marketId as string) : undefined;
      console.log('Fetching evidence for marketId:', marketId);

      const evidenceData = await db.query.evidence.findMany({
        where: marketId !== undefined ? eq(evidence.marketId, marketId) : undefined,
        with: {
          votes: true,
          user: true,
        },
        orderBy: desc(evidence.createdAt),
      });

      console.log('Found evidence:', evidenceData);
      res.json(evidenceData);
    } catch (error) {
      console.error('Error fetching evidence:', error);
      res.status(500).json({ error: 'Failed to fetch evidence' });
    }
  });

  // Predictions routes
  app.post("/api/predictions", async (req, res) => {
    const { marketId, position, amount } = req.body;
    
    // Validate required fields
    if (!marketId || !position || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify market exists
    const market = await db.query.markets.findFirst({
      where: eq(markets.id, marketId)
    });

    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }

    try {
      // Use a transaction to update both predictions and market odds
      const prediction = await db.transaction(async (tx) => {
        // Create the prediction
        const [newPrediction] = await tx
          .insert(predictions)
          .values({
            userId: 1,
            marketId,
            position,
            amount: amount.toString(),
            probability: "0.5",
            createdAt: new Date()
          })
          .returning();

        // Get all predictions for this market
        const marketPredictions = await tx.query.predictions.findMany({
          where: eq(predictions.marketId, marketId),
        });

        // Calculate new odds using the shared function
        const { marketOdds, yesAmount, noAmount, totalLiquidity } = 
          calculateMarketOdds(marketPredictions, marketId);

        // Update market with new odds
        await tx
          .update(markets)
          .set({
            currentOdds: marketOdds.toString(),
            yesAmount: yesAmount.toString(),
            noAmount: noAmount.toString(),
            totalLiquidity: totalLiquidity.toString(),
          })
          .where(eq(markets.id, marketId));

        // After updating market odds, record in history
        await tx.insert(marketOddsHistory).values({
          marketId,
          yesOdds: marketOdds.toString(),
          noOdds: (1 - marketOdds).toString(),
          yesAmount: yesAmount.toString(),
          noAmount: noAmount.toString(),
          totalLiquidity: totalLiquidity.toString()
        });

        return newPrediction;
      });

      res.json(prediction);
    } catch (error) {
      console.error('Error creating prediction:', error);
      res.status(500).json({ error: 'Failed to create prediction' });
    }
  });

  app.get("/api/predictions", async (req, res) => {
    try {
      const allPredictions = await db.query.predictions.findMany({
        orderBy: desc(predictions.createdAt),
        with: {
          user: true,
          market: true,
        },
      });
      res.json(allPredictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      res.status(500).json({ error: 'Failed to fetch predictions' });
    }
  });

  app.post("/api/vote", async (req, res) => {
    const { evidenceId, isUpvote } = req.body;
    const userId = 1; // Default user ID

    try {
      // Get the evidence to find its author
      const [evidenceItem] = await db
        .select()
        .from(evidence)
        .where(eq(evidence.id, evidenceId))
        .limit(1);

      if (!evidenceItem) {
        return res.status(404).json({ error: "Evidence not found" });
      }

      // Create the vote with correct value
      await db.insert(votes).values({
        userId,
        evidenceId,
        value: isUpvote ? 1 : -1,  // Make sure upvote is 1, downvote is -1
        createdAt: new Date()
      });

      // Update author's reputation correctly
      await db
        .update(users)
        .set({
          upvotesReceived: sql`${users.upvotesReceived} + ${isUpvote ? 1 : 0}`,
          downvotesReceived: sql`${users.downvotesReceived} + ${!isUpvote ? 1 : 0}`,
          reputation: sql`${users.reputation} + ${isUpvote ? 1 : -1}`,
        })
        .where(eq(users.id, evidenceItem.userId));

      // Return updated evidence
      const updatedEvidence = await db.query.evidence.findMany({
        with: {
          votes: true,
          user: true,
        },
        orderBy: desc(evidence.createdAt),
      });

      res.json(updatedEvidence);
    } catch (error) {
      console.error('Error handling vote:', error);
      res.status(500).json({ error: 'Failed to process vote' });
    }
  });

  // Add endpoint to get user reputation
  app.get("/api/user/:id/reputation", async (req, res) => {
    try {
      const [user] = await db
        .select({
          reputation: users.reputation,
          upvotesReceived: users.upvotesReceived,
          downvotesReceived: users.downvotesReceived,
        })
        .from(users)
        .where(eq(users.id, parseInt(req.params.id)))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user reputation:', error);
      res.status(500).json({ error: 'Failed to fetch reputation' });
    }
  });

  app.post("/api/markets", async (req, res) => {
    try {
      console.log('🎯 POST /api/markets route hit');
      const { title, yesResolution, noResolution } = req.body;
      
      const [newMarket] = await db
        .insert(markets)
        .values({
          title,
          description: "",  // Add empty string as default
          creatorId: 1,
          yesOdds: "0.5",
          noOdds: "0.5",
          yesResolution,
          noResolution,
          createdAt: new Date(),
          participants: 0,
          totalLiquidity: "0"
        })
        .returning();

      // Fetch full market data with relations
      const marketWithDetails = await db.query.markets.findFirst({
        where: eq(markets.id, newMarket.id),
        with: {
          predictions: true,
          evidence: true,
        }
      });

      console.log('✅ Market created with details:', marketWithDetails);
      res.json(marketWithDetails);
    } catch (error) {
      console.error('❌ Error creating market:', error);
      res.status(500).json({ error: 'Failed to create market' });
    }
  });

  app.get("/api/markets/:id/odds-history", async (req, res) => {
    const { id } = req.params;
    
    try {
      const history = await db.query.marketOddsHistory.findMany({
        where: eq(marketOddsHistory.marketId, Number(id)),
        orderBy: asc(marketOddsHistory.timestamp)
      });
      
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch odds history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}