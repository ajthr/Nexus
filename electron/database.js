const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'nexus.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    scheduled_at DATETIME NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notified BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'javascript',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rss_feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    last_fetched DATETIME,
    active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS rss_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feed_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    link TEXT,
    pub_date DATETIME,
    content TEXT,
    read_later BOOLEAN DEFAULT 0,
    read BOOLEAN DEFAULT 0,
    FOREIGN KEY (feed_id) REFERENCES rss_feeds(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS grid_layout (
    position INTEGER PRIMARY KEY,
    section_type TEXT NOT NULL
  );
`);

// Insert default grid layout if not exists
const layoutCheck = db.prepare('SELECT COUNT(*) as count FROM grid_layout').get();
if (layoutCheck.count === 0) {
  const insertLayout = db.prepare('INSERT INTO grid_layout (position, section_type) VALUES (?, ?)');
  insertLayout.run(0, 'notes');
  insertLayout.run(1, 'tasks');
  insertLayout.run(2, 'snippets');
  insertLayout.run(3, 'timer');
}

module.exports = db;
