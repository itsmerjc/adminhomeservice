import { executeQuery } from './src/config/db.js';

async function testDatabaseSchema() {
  try {
    console.log('Testing database schema for report functionality...');
    
    // Check if service_requests table exists and has required columns
    const serviceRequestsQuery = await executeQuery(`
      DESCRIBE service_requests
    `);
    console.log('service_requests table structure:', serviceRequestsQuery);
    
    // Check if providers table exists 
    const providersQuery = await executeQuery(`
      DESCRIBE providers
    `);
    console.log('providers table structure:', providersQuery);
    
    // Check if users table exists
    const usersQuery = await executeQuery(`
      DESCRIBE users
    `);
    console.log('users table structure:', usersQuery);
    
    // Check if services table exists
    const servicesQuery = await executeQuery(`
      DESCRIBE services
    `);
    console.log('services table structure:', servicesQuery);
    
    // Test the report query with sample data
    const sampleReport = await executeQuery(`
      SELECT 
        COUNT(*) as total_residents
      FROM users
    `);
    console.log('Sample query result:', sampleReport);
    
    console.log('Database schema test completed successfully!');
    
  } catch (error) {
    console.error('Database schema test failed:', error);
  }
}

testDatabaseSchema();
