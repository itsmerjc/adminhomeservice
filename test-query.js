// Direct test of the report API query
import { executeQuery } from './src/config/db.js';

async function testReportQuery() {
  try {
    console.log('Testing the service stats query directly...');
    
    const dateParams = ['2025-07-01'];
    
    // Test the problematic query
    const serviceStatsQuery = await executeQuery(`
      SELECT 
        s.name as service_name,
        'General' as category,
        COUNT(sr.id) as request_count,
        SUM(COALESCE(sr.total_amount, 0)) as total_revenue,
        AVG(COALESCE(sr.total_amount, 0)) as avg_price
      FROM services s
      LEFT JOIN service_requests sr ON s.id = sr.service_id 
        AND sr.created_at >= ?
        AND sr.status = 'completed'
      GROUP BY s.id, s.name
      ORDER BY total_revenue DESC
    `, dateParams);
    
    console.log('✅ Query executed successfully!');
    console.log('Results:', serviceStatsQuery);
    
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.error('Error details:', error);
  }
}

testReportQuery();
