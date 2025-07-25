// Simple test script to verify the report API is working
import fetch from 'node-fetch';

async function testReportAPI() {
  try {
    console.log('Testing Report API...');
    
    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/report?period=monthly');
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Report API working successfully!');
      console.log('Report Data Summary:');
      console.log('- Total Residents:', data.data.summary.totalResidents);
      console.log('- Total Providers:', data.data.summary.totalProviders);
      console.log('- Completed Services:', data.data.summary.completedServices);
      console.log('- Total Earnings:', data.data.summary.totalEarnings);
      console.log('- Admin Tax Earnings:', data.data.summary.adminTaxEarnings);
      
      if (data.data.topPerformers.topProvider) {
        console.log('- Top Provider:', data.data.topPerformers.topProvider.name);
      }
      
      if (data.data.topPerformers.topUser) {
        console.log('- Top User:', data.data.topPerformers.topUser.first_name, data.data.topPerformers.topUser.last_name);
      }
      
      console.log('- Provider Rankings Count:', data.data.providerRankings.length);
    } else {
      console.error('❌ API returned error:', data.error);
      console.error('Details:', data.details);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testReportAPI();
