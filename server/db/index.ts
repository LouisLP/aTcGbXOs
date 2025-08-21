import sqlite3 from "sqlite3";
import { promisify } from "util";
import path from "path";

const dbPath = path.join(process.cwd(), "comments.db");

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private async init() {
    const run = promisify(this.db.run.bind(this.db));

    await run(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        parent_id TEXT,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
      )
    `);
  }

  async getAllComments(): Promise<DbComment[]> {
    const all = promisify(this.db.all.bind(this.db));
    return all("SELECT * FROM comments ORDER BY created_at ASC") as Promise<
      DbComment[]
    >;
  }

  async addComment(id: string, text: string, parentId?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        "INSERT INTO comments (id, text, parent_id) VALUES (?, ?, ?)",
        [id, text, parentId || null],
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });
  }

  async deleteComment(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run("DELETE FROM comments WHERE id = ?", [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

export interface DbComment {
  id: string;
  text: string;
  created_at: string;
  parent_id: string | null;
}

export default Database;
