const { app, BrowserWindow, ipcMain, Notification, shell } = require('electron');
const { join } = require('path');
const Database = require('better-sqlite3');
const RssParser = require('rss-parser');
const Store = require('electron-store');

const store = new Store();
const rssParser = new RssParser();

// Database setup
const dbPath = join(app.getPath('userData'), 'nexus.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
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

let mainWindow;
let rssCheckInterval;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.setMenuBarVisibility(false)

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // FIX: Changed '../dist/index.html' to 'dist/index.html'. 
    // In ASAR, __dirname is the archive root, so we look directly into the 'dist' folder inside it.
    mainWindow.loadFile(join(__dirname, 'dist', 'index.html')).catch(err => {
      console.error("Failed to load production index.html:", err);
    });
  }

  // Set CSP for development
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          isDev 
            ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 ws://localhost:5173; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173; style-src 'self' 'unsafe-inline';"
            : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
        ]
      }
    });
  });

  // Start RSS feed checking
  startRssFeedChecker();
  
  // Start task notification checker
  startTaskNotificationChecker();
}

// RSS Feed Functions
function startRssFeedChecker() {
  checkRssFeeds(); // Check immediately
  rssCheckInterval = setInterval(checkRssFeeds, 15 * 60 * 1000); // Every 15 minutes
}

async function checkRssFeeds() {
  const feeds = db.prepare('SELECT * FROM rss_feeds WHERE active = 1').all();
  
  for (const feed of feeds) {
    try {
      const parsedFeed = await rssParser.parseURL(feed.url);
      
      // Update feed title if not set
      if (!feed.title) {
        db.prepare('UPDATE rss_feeds SET title = ? WHERE id = ?').run(parsedFeed.title, feed.id);
      }
      
      let hasNewItems = false;
      
      // Insert new items
      for (const item of parsedFeed.items) {
        const exists = db.prepare('SELECT id FROM rss_items WHERE feed_id = ? AND link = ?')
          .get(feed.id, item.link);
        
        if (!exists) {
          db.prepare(`
            INSERT INTO rss_items (feed_id, title, link, pub_date, content)
            VALUES (?, ?, ?, ?, ?)
          `).run(feed.id, item.title, item.link, item.pubDate, item.contentSnippet || '');
          
          hasNewItems = true;
          
          // Send notification for new item
          if (Notification.isSupported()) {
            const notification = new Notification({
              title: 'New RSS Item',
              body: `${parsedFeed.title}: ${item.title}`,
            });
            
            // Make notification clickable
            notification.on('click', () => {
              if (item.link) {
                shell.openExternal(item.link);
              }
            });
            
            notification.show();
          }
        }
      }
      
      db.prepare('UPDATE rss_feeds SET last_fetched = CURRENT_TIMESTAMP WHERE id = ?').run(feed.id);
      
      // Only notify renderer if there are new items
      if (hasNewItems && mainWindow) {
        mainWindow.webContents.send('rss-updated');
      }
    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.url}:`, error);
    }
  }
}

// Task Notification Checker
function startTaskNotificationChecker() {
  setInterval(() => {
    const now = new Date().toISOString();
    const tasks = db.prepare(`
      SELECT * FROM tasks 
      WHERE scheduled_at <= ? 
      AND completed = 0 
      AND notified = 0
    `).all(now);
    
    tasks.forEach(task => {
      if (Notification.isSupported()) {
        const notification = new Notification({
          title: 'Task Reminder',
          body: task.title,
        });
        notification.show();
      }
      
      db.prepare('UPDATE tasks SET notified = 1 WHERE id = ?').run(task.id);
    });
    
    if (tasks.length > 0 && mainWindow) {
      mainWindow.webContents.send('tasks-updated');
    }
  }, 60000); // Check every minute
}

// IPC Handlers

// Notes
ipcMain.handle('get-notes', () => {
  return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
});

ipcMain.handle('add-note', (event, { title, content }) => {
  const result = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content);
  return { id: result.lastInsertRowid, title, content, created_at: new Date().toISOString() };
});

ipcMain.handle('update-note', (event, { id, title, content }) => {
  db.prepare('UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(title, content, id);
  return true;
});

ipcMain.handle('delete-note', (event, id) => {
  db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return true;
});

// Tasks
ipcMain.handle('get-tasks', () => {
  return db.prepare('SELECT * FROM tasks ORDER BY scheduled_at ASC').all();
});

ipcMain.handle('add-task', (event, { title, scheduledAt }) => {
  const result = db.prepare('INSERT INTO tasks (title, scheduled_at) VALUES (?, ?)')
    .run(title, scheduledAt);
  return { id: result.lastInsertRowid, title, scheduled_at: scheduledAt, completed: false };
});

ipcMain.handle('update-task', (event, { id, completed, title, scheduledAt }) => {
  if (title !== undefined && scheduledAt !== undefined) {
    // Update title and scheduled time
    db.prepare('UPDATE tasks SET title = ?, scheduled_at = ?, notified = 0 WHERE id = ?')
      .run(title, scheduledAt, id);
  } else if (completed !== undefined) {
    // Update only completion status
    db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  }
  return true;
});

ipcMain.handle('delete-task', (event, id) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return true;
});

// Snippets
ipcMain.handle('get-snippets', () => {
  return db.prepare('SELECT * FROM snippets ORDER BY created_at DESC').all();
});

ipcMain.handle('add-snippet', (event, { title, content, language }) => {
  const result = db.prepare('INSERT INTO snippets (title, content, language) VALUES (?, ?, ?)')
    .run(title, content, language);
  return { id: result.lastInsertRowid, title, content, language, created_at: new Date().toISOString() };
});

ipcMain.handle('delete-snippet', (event, id) => {
  db.prepare('DELETE FROM snippets WHERE id = ?').run(id);
  return true;
});

// RSS Feeds
ipcMain.handle('get-rss-feeds', () => {
  return db.prepare('SELECT * FROM rss_feeds WHERE active = 1').all();
});

ipcMain.handle('get-rss-items', (event, { feedId, readLater }) => {
  let query = 'SELECT ri.*, rf.title as feed_title FROM rss_items ri JOIN rss_feeds rf ON ri.feed_id = rf.id';
  
  if (feedId) {
    query += ` WHERE ri.feed_id = ${feedId}`;
  }
  
  if (readLater) {
    query += feedId ? ' AND' : ' WHERE';
    query += ' ri.read_later = 1';
  }
  
  query += ' ORDER BY ri.pub_date DESC LIMIT 50';
  
  return db.prepare(query).all();
});

ipcMain.handle('add-rss-feed', async (event, url) => {
  try {
    const result = db.prepare('INSERT INTO rss_feeds (url) VALUES (?)').run(url);
    await checkRssFeeds();
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('toggle-read-later', (event, { id, readLater }) => {
  db.prepare('UPDATE rss_items SET read_later = ? WHERE id = ?').run(readLater ? 1 : 0, id);
  return true;
});

ipcMain.handle('delete-rss-feed', (event, id) => {
  db.prepare('DELETE FROM rss_feeds WHERE id = ?').run(id);
  return true;
});

// Grid Layout
ipcMain.handle('get-grid-layout', () => {
  return db.prepare('SELECT * FROM grid_layout ORDER BY position').all();
});

ipcMain.handle('update-grid-layout', (event, layout) => {
  const update = db.prepare('UPDATE grid_layout SET section_type = ? WHERE position = ?');
  layout.forEach((sectionType, position) => {
    update.run(sectionType, position);
  });
  return true;
});

// Theme
ipcMain.handle('get-theme', () => {
  return store.get('theme', 'system');
});

ipcMain.handle('set-theme', (event, theme) => {
  store.set('theme', theme);
  return true;
});

// Export/Import
ipcMain.handle('export-data', () => {
  const data = {
    notes: db.prepare('SELECT * FROM notes').all(),
    tasks: db.prepare('SELECT * FROM tasks').all(),
    snippets: db.prepare('SELECT * FROM snippets').all(),
    rssFeeds: db.prepare('SELECT * FROM rss_feeds').all(),
    gridLayout: db.prepare('SELECT * FROM grid_layout').all(),
    settings: { theme: store.get('theme', 'system') },
    exportDate: new Date().toISOString(),
  };
  return data;
});

ipcMain.handle('import-data', (event, data) => {
  try {
    db.exec('BEGIN TRANSACTION');
    
    // Clear existing data
    db.exec(`
      DELETE FROM notes;
      DELETE FROM tasks;
      DELETE FROM snippets;
      DELETE FROM rss_feeds;
      DELETE FROM grid_layout;
    `);
    
    // Import notes
    const insertNote = db.prepare('INSERT INTO notes (title, content, created_at) VALUES (?, ?, ?)');
    data.notes?.forEach(note => insertNote.run(note.title, note.content, note.created_at));
    
    // Import tasks
    const insertTask = db.prepare('INSERT INTO tasks (title, scheduled_at, completed) VALUES (?, ?, ?)');
    data.tasks?.forEach(task => insertTask.run(task.title, task.scheduled_at, task.completed));
    
    // Import snippets
    const insertSnippet = db.prepare('INSERT INTO snippets (title, content, language) VALUES (?, ?, ?)');
    data.snippets?.forEach(snippet => insertSnippet.run(snippet.title, snippet.content, snippet.language));
    
    // Import RSS feeds
    const insertFeed = db.prepare('INSERT INTO rss_feeds (url, title) VALUES (?, ?)');
    data.rssFeeds?.forEach(feed => insertFeed.run(feed.url, feed.title));
    
    // Import grid layout
    const insertLayout = db.prepare('INSERT INTO grid_layout (position, section_type) VALUES (?, ?)');
    data.gridLayout?.forEach(item => insertLayout.run(item.position, item.section_type));
    
    // Import settings
    if (data.settings?.theme) {
      store.set('theme', data.settings.theme);
    }
    
    db.exec('COMMIT');
    return { success: true };
  } catch (error) {
    db.exec('ROLLBACK');
    return { success: false, error: error.message };
  }
});

// Show notification
ipcMain.handle('show-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
  return true;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (rssCheckInterval) clearInterval(rssCheckInterval);
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
