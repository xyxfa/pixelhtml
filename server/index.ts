import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { sql } from "@vercel/postgres";
import dotenv from "dotenv";
dotenv.config();

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.use(express.json()); // For parsing application/json

  // Guestbook API routes
  app.get("/api/guestbook", async (_req, res) => {
    try {
      const { rows } = await sql`
        SELECT id, name, content, created_at as date 
        FROM guestbook_messages 
        ORDER BY created_at DESC 
        LIMIT 100;
      `;
      // Format dates properly
      const formattedRows = rows.map(r => ({
        ...r,
        id: String(r.id),
        date: new Date(r.date).toLocaleDateString()
      }));
      res.json(formattedRows);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/guestbook", async (req, res) => {
    const { name, content } = req.body;

    if (!name || !content || name.trim() === "" || content.trim() === "") {
      return res.status(400).json({ error: "Name and content are required" });
    }

    try {
      const result = await sql`
        INSERT INTO guestbook_messages (name, content)
        VALUES (${name.trim()}, ${content.trim()})
        RETURNING id, name, content, created_at as date;
      `;

      const newMsg = result.rows[0];
      res.status(201).json({
        ...newMsg,
        id: String(newMsg.id),
        date: new Date(newMsg.date).toLocaleDateString()
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save message" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
