
const { Client } = require('pg');

const client = new Client({
  user: process.env.PGUSER||"postgres",
  host: process.env.PGHOST||"localhost",
  database: process.env.PGDATABASE||"Book rental",
  password: process.env.PGPASSWORD||"postgress",
  port: process.env.PGPORT||5432,
});

const seedCategories = async () => {
  const categories = [
    { name: 'Fiction' },
    { name: 'Non-Fiction' },
    { name: 'Science' },
    { name: 'Technology' },
    { name: 'History' },
    { name: 'Biography' },
  ];

  try {
    await client.connect();

    for (let category of categories) {
      await client.query(
        `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [category.name]
      );
    }

    console.log('Categories seeded successfully!');
  } catch (err) {
    console.error('Error seeding categories:', err);
  } finally {
    await client.end();
  }
};

seedCategories();
