const db = require('../lib/db');

console.log('PGUSER:', process.env.PGUSER);
console.log('PGHOST:', process.env.PGHOST);
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('PGPASSWORD:', process.env.PGPASSWORD); 
console.log('PGPORT:', process.env.PGPORT);

async function initDb() {
  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(100),
      role VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(100),
      author VARCHAR(100),
      category VARCHAR(100),
      available BOOLEAN DEFAULT TRUE,
      owner_id INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS rentals (
      id SERIAL PRIMARY KEY,
      book_id INTEGER REFERENCES books(id),
      renter_id INTEGER REFERENCES users(id),
      rent_date TIMESTAMPTZ DEFAULT NOW(),
      return_date TIMESTAMPTZ,
      status VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await db.query(createTables);
  console.log('Database initialized');
}

initDb().catch((err) => {
  console.error('Error initializing database', err);
  process.exit(1);
});
