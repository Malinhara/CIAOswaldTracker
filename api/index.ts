// src/api/index.ts

import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { testConnection } from "../db/index.js"; // ✅ Use .js even for TS because compiled output is .js
import { registerRoutes } from "./routes.js";

console.log("do we get to index.ts?");

const app = express();
app.use(express.json());

// Handle preflight (CORS)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;
  let capturedJsonResponse: any;

  const originalJson = res.json.bind(res);
  res.json = (body, ...args) => {
    capturedJsonResponse = body;
    return originalJson(body, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathReq.startsWith("/api")) {
      let log = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        log += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(log);
    }
  });

  next();
});

(async () => {
  try {
    await testConnection();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  const server = registerRoutes(app);

  // Global error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error details:", err);
    res.status(status).json({ message });
  });

  const isProd = process.env.NODE_ENV === "production";
  console.log(`Starting server in ${isProd ? "production" : "development"} mode`);

  if (!isProd) {
    const { setupVite } = await import("./vite.js"); // TS → .js after build
    await setupVite(app, server);
  } else {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const distPath = path.resolve(__dirname, "../../dist/public");

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
