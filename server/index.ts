import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import Database from "./db";
import { buildCommentTree, commentToApi } from "./utils";
import type { ApiComment } from "./types";

const app = express();
const PORT_NUMBER = 3001;
const db = new Database();

app.use(cors());
app.use(express.json());

// Get all comments
app.get("/api/comments", async (_, res) => {
  try {
    const dbComments = await db.getAllComments();
    const commentTree = buildCommentTree(dbComments);
    const apiComments = commentTree.map(commentToApi);
    res.json(apiComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a new comment
app.post("/api/comments", async (req, res) => {
  try {
    const { text, parentId } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const id = randomUUID();
    await db.addComment(id, text.trim(), parentId);

    // Return proper ApiComment structure
    const newApiComment: ApiComment = {
      id,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      parentId,
      replies: [], // Initialize empty replies array
    };

    res.status(201).json(newApiComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Delete a comment
app.delete("/api/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteComment(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// Health check
app.get("/api/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  db.close();
  process.exit(0);
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server running at http://localhost:${PORT_NUMBER}`);
});
