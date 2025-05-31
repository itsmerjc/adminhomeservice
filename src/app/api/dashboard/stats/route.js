import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../config/db.js';

export async function GET() {
  try {
    // Get resident count from users table
    const residentsQuery = await executeQuery('SELECT COUNT(*) as count FROM users');
    let residentCount = 0;
    if (residentsQuery && residentsQuery[0]) {
      residentCount = parseInt(residentsQuery[0].count) || 0;
    }

    // Get provider count from provider_accounts table
    const providersQuery = await executeQuery('SELECT COUNT(*) as count FROM provider_accounts');
    let providerCount = 0;
    if (providersQuery && providersQuery[0]) {
      providerCount = parseInt(providersQuery[0].count) || 0;
    }

    // Log the counts for debugging
    console.log('Fetched counts:', { residentCount, providerCount });

    return NextResponse.json({
      stats: {
        residents: residentCount,
        providers: providerCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard statistics',
        details: error.message 
      },
      { status: 500 }
    );
  }
}