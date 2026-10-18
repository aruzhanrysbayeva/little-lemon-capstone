import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('little_lemon.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL
    );
  `);
};

export const getMenuItems = async () => {
  return db.getAllAsync('SELECT * FROM menu');
};

export const saveMenuItems = async (menuItems) => {
  db.withTransactionSync(() => {
    for (const item of menuItems) {
      db.runSync(
        `INSERT OR REPLACE INTO menu (id, name, price, description, image, category) 
         VALUES (?, ?, ?, ?, ?, ?);`,
        [item.id, item.name, item.price, item.description, item.image, item.category]
      );
    }
  });
};

export const filterMenuItems = async (query, activeCategories) => {
  let sql = 'SELECT * FROM menu WHERE 1=1';
  const params = [];

  if (query && query.trim().length > 0) {
    sql += ' AND name LIKE ?';
    params.push(`%${query.trim()}%`);
  }

  if (activeCategories && activeCategories.length > 0) {
    const placeholders = activeCategories.map(() => '?').join(',');
    sql += ` AND category IN (${placeholders})`;
    params.push(...activeCategories);
  }

  return db.getAllAsync(sql, params);
};
