import Database from 'better-sqlite3';

let db;

export function initDB() {
  db = new Database('./database.sqlite');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT,
      dosage TEXT,
      frequency TEXT,
      takenDates TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);
}

export const getDB = () => db;
