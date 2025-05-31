import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
  // Add connection retry and timeout settings
  connectTimeout: 30000, // Increased timeout
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Mock database storage - only used if explicitly enabled
const mockDb = {
  providers: [
    {
      id: 1,
      name: 'John Smith Plumbing',
      contact: '555-123-4567',
      logo_url: 'https://res.cloudinary.com/dzu67akrs/image/upload/v1720302010/provider-logos/sample-plumbing-logo.png',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Sarah\'s Electrical Services',
      contact: '555-987-6543',
      logo_url: 'https://res.cloudinary.com/dzu67akrs/image/upload/v1720302010/provider-logos/sample-electrical-logo.png',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  services: [
    {
      id: 1,
      provider_id: 1,
      name: 'Basic Plumbing Repair',
      price: 75.00,
      description: 'Fixing leaks, clogs, and basic plumbing issues',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      provider_id: 1,
      name: 'Pipe Installation',
      price: 150.00,
      description: 'Installing new pipes and plumbing systems',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      provider_id: 2,
      name: 'Electrical Wiring',
      price: 95.00,
      description: 'Installation and repair of electrical wiring',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  nextProviderId: 3,
  nextServiceId: 4
};

// Create a mock implementation for development when database is not available
const mockExecuteQuery = (query, params = []) => {
  console.log('MOCK DB QUERY:', query, params);
  
  // Handle different query types
  if (query.includes('CREATE TABLE IF NOT EXISTS')) {
    return [[]]; // Return empty result set
  }
  
  // Handle COUNT queries
  if (query.includes('SELECT COUNT(*) as count')) {
    return [[{ count: 0 }]];
  }
  
  // INSERT INTO providers
  if (query.includes('INSERT INTO providers')) {
    const [name, contact, logoUrl] = params;
    const id = mockDb.nextProviderId++;
    const newProvider = {
      id,
      name,
      contact,
      logo_url: logoUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.providers.push(newProvider);
    return [[{ insertId: id }]];
  }
  
  // INSERT INTO services
  if (query.includes('INSERT INTO services')) {
    const [providerId, name, price, description] = params;
    const id = mockDb.nextServiceId++;
    const newService = {
      id,
      provider_id: providerId,
      name,
      price,
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.services.push(newService);
    return [[{ insertId: id }]];
  }
  
  // SELECT * FROM providers WHERE id = ?
  if (query.includes('SELECT * FROM providers WHERE id =')) {
    const id = params[0];
    return [mockDb.providers.filter(p => p.id == id)];
  }
  
  // SELECT * FROM services WHERE provider_id = ?
  if (query.includes('SELECT * FROM services WHERE provider_id =')) {
    const providerId = params[0];
    return [mockDb.services.filter(s => s.provider_id == providerId)];
  }
  
  // SELECT * FROM providers ORDER BY created_at DESC
  if (query.includes('SELECT * FROM providers ORDER BY')) {
    return [[...mockDb.providers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))];
  }
  
  // DELETE FROM providers WHERE id = ?
  if (query.includes('DELETE FROM providers WHERE id =')) {
    const id = params[0];
    const initialLength = mockDb.providers.length;
    mockDb.providers = mockDb.providers.filter(p => p.id != id);
    
    // Also delete associated services
    mockDb.services = mockDb.services.filter(s => s.provider_id != id);
    
    return [[{ affectedRows: initialLength - mockDb.providers.length }]];
  }
  
  // Default response for unknown queries
  return [[]];
};

// Debug database configuration
console.log('Actual Database Configuration:', {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  port: process.env.DB_PORT
});

// Create a pool to manage connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false  // Allow self-signed certificates
  }
});

// Test the connection immediately
pool.getConnection()
  .then((connection) => {
    console.log('Database connection successful');
    connection.release();
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });



/**
 * Test the database connection
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Execute a database query with parameters
 * @param {string} query - SQL query with placeholders
 * @param {Array} params - Parameters for the query placeholders
 * @returns {Promise<Array|Object>} - Query results
 */
async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
}

/**
 * Execute a direct query without prepared statements
 * Used for transactions and other commands not supported by prepared statements
 * @param {string} query - SQL query string
 * @returns {Promise<Array|Object>} - Query results
 */
async function executeDirectQuery(query) {
  try {
    // Use query() instead of execute() for transaction commands
    const [results] = await pool.query(query);
    return results;
  } catch (error) {
    console.error('Direct query execution failed:', error);
    throw error;
  }
}

/**
 * Start a database transaction
 */
async function beginTransaction() {
  return executeDirectQuery('START TRANSACTION');
}

/**
 * Commit a database transaction
 */
async function commitTransaction() {
  return executeDirectQuery('COMMIT');
}

/**
 * Rollback a database transaction
 */
async function rollbackTransaction() {
  return executeDirectQuery('ROLLBACK');
}

// Initialize by testing the connection once
testConnection().then(connected => {
  if (connected) {
    console.log('Database is ready');
  } else {
    console.error('Failed to connect to the database');
  }
});

export { executeQuery, executeDirectQuery, beginTransaction, commitTransaction, rollbackTransaction, testConnection }; 