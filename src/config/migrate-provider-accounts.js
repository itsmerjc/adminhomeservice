import { executeQuery, beginTransaction, commitTransaction, rollbackTransaction } from './db.js';
import bcrypt from 'bcryptjs';

// Helper function to generate a username based on provider name
function generateUsername(name) {
  // Remove spaces, convert to lowercase, and add random digits
  const baseUsername = name.toLowerCase().replace(/\s+/g, '');
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `${baseUsername}${randomDigits}`;
}

// Check if username already exists
async function usernameExists(username) {
  const [result] = await executeQuery(
    `SELECT COUNT(*) as count FROM provider_accounts WHERE username = ?`,
    [username]
  );
  return result.count > 0;
}

// Generate a unique username
async function generateUniqueUsername(name) {
  let username = generateUsername(name);
  let attempts = 0;
  const maxAttempts = 5;
  
  // Check if username exists and regenerate if needed
  while (await usernameExists(username) && attempts < maxAttempts) {
    username = generateUsername(name);
    attempts++;
  }
  
  return username;
}

/**
 * Migrates provider credentials from providers table to provider_accounts table
 */
async function migrateProviderAccounts() {
  console.log('Starting migration of provider accounts...');
  
  let useTransactions = true;
  
  try {
    // Check if the old providers table has username and password columns
    const [hasOldColumns] = await executeQuery(`
      SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'providers' 
      AND COLUMN_NAME IN ('username', 'password')
      HAVING count = 2
    `);
    
    if (hasOldColumns.count !== 2) {
      console.log('Old table does not have required columns. No migration needed.');
      return;
    }
    
    // Get all providers with username and password
    const providers = await executeQuery(`
      SELECT id, name, username, password
      FROM providers
      WHERE username IS NOT NULL AND password IS NOT NULL
    `);
    
    console.log(`Found ${providers.length} providers to migrate`);
    
    // If there are no providers to migrate, we can skip the transaction
    if (providers.length === 0) {
      console.log('No providers to migrate. Skipping.');
      return;
    }
    
    // Try to start transaction, fall back to direct queries if not supported
    try {
      await beginTransaction();
    } catch (transactionError) {
      console.log('Transactions not supported, proceeding without transactions:', transactionError.message);
      useTransactions = false;
    }
    
    // Track migrated providers to clean up in case of error
    const migratedProviderIds = [];
    
    // Migrate each provider
    for (const provider of providers) {
      // Check if provider already has an account in the new table
      const [existingAccount] = await executeQuery(`
        SELECT COUNT(*) as count FROM provider_accounts WHERE provider_id = ?
      `, [provider.id]);
      
      if (existingAccount.count > 0) {
        console.log(`Provider ${provider.id} already has an account. Skipping.`);
        continue;
      }
      
      // Generate a unique username if the old one is null
      const username = provider.username || await generateUniqueUsername(provider.name);
      
      // Insert into provider_accounts
      await executeQuery(`
        INSERT INTO provider_accounts (provider_id, username, password) 
        VALUES (?, ?, ?)
      `, [provider.id, username, provider.password]);
      
      migratedProviderIds.push(provider.id);
      console.log(`Migrated account for provider ${provider.id} with username ${username}`);
    }
    
    // Commit transaction if we're using transactions
    if (useTransactions) {
      await commitTransaction();
    }
    
    console.log('Migration completed successfully');
    
    // Drop old columns if migration is successful
    console.log('Dropping old columns from providers table...');
    try {
      await executeQuery('ALTER TABLE providers DROP COLUMN username, DROP COLUMN password');
      console.log('Migration and cleanup completed');
    } catch (columnDropError) {
      console.error('Failed to drop old columns:', columnDropError);
      console.log('Migration completed but cleanup failed. You may need to drop the columns manually.');
    }
  } catch (error) {
    // Rollback transaction if we're using transactions
    if (useTransactions) {
      try {
        await rollbackTransaction();
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }
    }
    
    console.error('Migration failed:', error);
    throw error;
  }
}

export default migrateProviderAccounts; 