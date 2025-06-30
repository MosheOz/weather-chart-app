import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export async function openDb(): Promise<Database> {
  const fullPath = process.cwd() + "/weather.sqlite";

  console.log("Using SQLite file:", fullPath); // 👈 Add this

  return open({
    filename: fullPath,
    driver: sqlite3.Database,
  });
}
