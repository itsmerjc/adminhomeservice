import { executeQuery } from './db.js';
import migrateProviderAccounts from './migrate-provider-accounts.js';

// Initialize database schema (tables, etc)
async function initializeDatabase() {
  try {
    // Create providers table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS providers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        logo_url TEXT NULL,
        business_type VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create provider_accounts table for authentication data
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS provider_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        provider_id INT NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
        UNIQUE KEY (username)
      )
    `);

    // Check if the email column exists, add it if it doesn't
    const [emailColumnExists] = await executeQuery(`
      SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'providers' AND COLUMN_NAME = 'email'
    `);

    // If email column doesn't exist, add it
    if (emailColumnExists.count === 0) {
      await executeQuery(`ALTER TABLE providers ADD COLUMN email VARCHAR(255) NULL`);
      console.log('Added email column to providers table');
    }

    // Create services table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        provider_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
      )
    `);

    console.log('Database schema initialized successfully');

    // Run migration to move provider credentials to the new table
    await migrateProviderAccounts();
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

export default initializeDatabase; 