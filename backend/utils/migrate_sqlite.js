const fs = require('fs');
const path = require('path');
const { run } = require('./sqlite');

// Minimal SQLite schema for demo
const schemaSql = `
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  open_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  balance INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  course_id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time INTEGER NOT NULL, -- epoch ms
  end_time INTEGER NOT NULL,   -- epoch ms
  coach_id INTEGER,
  status TEXT DEFAULT 'SCHEDULED',
  coach_confirmed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS course_students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS checkin_logs (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  checkin_time TEXT DEFAULT (datetime('now')),
  user_role TEXT
);
`;

async function migrate(db) {
  const statements = schemaSql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await run(db, stmt);
  }
}

module.exports = { migrate };
