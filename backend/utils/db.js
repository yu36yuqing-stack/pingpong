
const path = require('path');

// Supported clients: mysql (default), sqlite (demo-friendly)
const DB_CLIENT = (process.env.DB_CLIENT || 'mysql').toLowerCase();

if (DB_CLIENT === 'sqlite') {
  const { openDb, run, all } = require('./sqlite');
  const { migrate } = require('./migrate_sqlite');

  const dbFile = process.env.SQLITE_PATH || path.join(process.cwd(), 'data.sqlite');
  const db = openDb(dbFile);

  // lightweight adapter to mimic mysql2/promise: db.query(sql, params) -> [rows]
  const adapter = {
    async query(sql, params = []) {
      const normalized = sql.trim().toLowerCase();
      if (normalized.startsWith('select')) {
        const rows = await all(db, sql, params);
        return [rows];
      }
      const result = await run(db, sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    },
    async migrate() {
      await migrate(db);
    }
  };

  module.exports = adapter;
} else {
  const mysql = require('mysql2');

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pingpong',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  module.exports = pool.promise();
}
