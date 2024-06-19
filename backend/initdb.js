const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'tokens.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS tokens (username TEXT PRIMARY KEY, tokens TEXT)", (err) => {
    if (err) {
      console.error('Error creating tokens table:', err);
    } else {
      console.log('Tokens table created or already exists.');
    }
  });
});

db.close();
