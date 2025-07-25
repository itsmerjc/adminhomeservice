import initializeDatabase from './src/config/init-db.js';

async function runInit() {
  try {
    console.log('Starting database initialization...');
    await initializeDatabase();
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
  process.exit();
}

runInit();
