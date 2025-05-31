import { executeQuery, beginTransaction, commitTransaction, rollbackTransaction } from '../../../config/db.js';
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

export async function createProvider(providerData) {
  const { name, contact, logoUrl, email, password, businessType } = providerData;
  
  console.log('Creating provider with data:', {
    name,
    contact,
    email,
    businessType,
    hasLogoUrl: !!logoUrl,
    hasPassword: !!password
  });
  
  let useTransactions = true;
  let providerId = null;
  
  try {
    // Try using transactions first
    try {
      // Start transaction
      await beginTransaction();
    } catch (transactionError) {
      console.log('Transactions not supported, falling back to direct queries:', transactionError.message);
      useTransactions = false;
    }
    
    // 1. Create the provider first
    const providerInsertResult = await executeQuery(
      `INSERT INTO providers (name, contact, logo_url, email, business_type) VALUES (?, ?, ?, ?, ?)`,
      [name, contact, logoUrl, email, businessType]
    );
    
    providerId = providerInsertResult.insertId;
    
    // 2. Generate a unique username for the provider account
    const username = await generateUniqueUsername(name);
    
    // 3. Hash the password if it exists
    let hashedPassword = null;
    if (password) {
      hashedPassword = password;
    } else {
      throw new Error('Password is required for provider account');
    }
    
    // 4. Create the provider account
    await executeQuery(
      `INSERT INTO provider_accounts (provider_id, username, password) VALUES (?, ?, ?)`,
      [providerId, username, hashedPassword]
    );
    
    // Commit the transaction if we're using transactions
    if (useTransactions) {
      await commitTransaction();
    }
    
    // 5. Get the created provider with account details
    const [createdProvider] = await executeQuery(
      `SELECT p.id, p.name, p.contact, p.logo_url, p.email, pa.username 
       FROM providers p
       JOIN provider_accounts pa ON p.id = pa.provider_id
       WHERE p.id = ?`,
      [providerId]
    );
    
    if (!createdProvider) {
      throw new Error('Provider was not created properly');
    }
    
    console.log('Provider created successfully:', {
      id: createdProvider.id,
      name: createdProvider.name,
      email: createdProvider.email,
      username: createdProvider.username,
      contact: createdProvider.contact
    });
    
    return { 
      id: createdProvider.id, 
      name: createdProvider.name, 
      contact: createdProvider.contact, 
      logo_url: createdProvider.logo_url, 
      email: createdProvider.email,
      username: createdProvider.username
    };
  } catch (error) {
    // Rollback the transaction in case of error if we're using transactions
    if (useTransactions) {
      try {
        await rollbackTransaction();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    } else if (providerId) {
      // If we're not using transactions but we created a provider, try to clean up
      try {
        await executeQuery('DELETE FROM providers WHERE id = ?', [providerId]);
      } catch (cleanupError) {
        console.error('Failed to clean up after error:', cleanupError);
      }
    }
    
    console.error('Error creating provider:', error);
    throw new Error('Failed to create provider in database: ' + error.message);
  }
}

export async function addService(serviceData) {
  const { providerId, name, price, description } = serviceData;
  
  try {
    const result = await executeQuery(
      `INSERT INTO services (provider_id, name, price, description) VALUES (?, ?, ?, ?)`,
      [providerId, name, price, description]
    );
    
    return { id: result.insertId, provider_id: providerId, name, price, description };
  } catch (error) {
    console.error('Error adding service:', error);
    throw new Error('Failed to add service to database');
  }
}

export async function getProviders() {
  try {
    // Join with provider_accounts to get username
    const providers = await executeQuery(`
      SELECT p.id, p.name, p.contact, p.logo_url, p.email, pa.username, p.created_at, p.updated_at 
      FROM providers p
      LEFT JOIN provider_accounts pa ON p.id = pa.provider_id
      ORDER BY p.created_at DESC`
    );
    
    // For each provider, get their services
    for (const provider of providers) {
      const services = await executeQuery(
        `SELECT * FROM services WHERE provider_id = ?`,
        [provider.id]
      );
      provider.services = services;
    }
    
    return providers;
  } catch (error) {
    console.error('Error getting providers:', error);
    throw new Error('Failed to get providers from database');
  }
}

export async function getProviderById(id) {
  try {
    // Join with provider_accounts to get username
    const [provider] = await executeQuery(`
      SELECT p.id, p.name, p.contact, p.logo_url, p.email, pa.username, p.created_at, p.updated_at 
      FROM providers p
      LEFT JOIN provider_accounts pa ON p.id = pa.provider_id
      WHERE p.id = ?`, 
      [id]
    );
    
    if (!provider) {
      return null;
    }
    
    const services = await executeQuery(`SELECT * FROM services WHERE provider_id = ?`, [id]);
    
    return {
      ...provider,
      services
    };
  } catch (error) {
    console.error(`Error getting provider with ID ${id}:`, error);
    throw new Error('Failed to get provider from database');
  }
}

export async function verifyProviderCredentials(username, password) {
  try {
    // Get provider account with password using username
    const [account] = await executeQuery(`
      SELECT pa.id, pa.provider_id, pa.password 
      FROM provider_accounts pa
      WHERE pa.username = ?`,
      [username]
    );

    if (!account || !account.password) {
      return false;
    }

    // Verify password
    const isMatch = password === account.password;
    return isMatch ? account.provider_id : false;
  } catch (error) {
    console.error('Error verifying provider credentials:', error);
    throw new Error('Failed to verify provider credentials');
  }
} 