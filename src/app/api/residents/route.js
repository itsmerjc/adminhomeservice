import { NextResponse } from 'next/server';
import { executeQuery } from '../../../config/db.js';

export async function GET() {
  try {
    // Fetch user data from the database
    // We'll join the users and user_profiles tables to get all the necessary information
    const residents = await executeQuery(`
      SELECT 
        u.id,
        u.email,
        p.name,
        p.mobile as phone,
        p.address,
        p.updated_at
      FROM 
        users u
      LEFT JOIN 
        user_profiles p ON u.id = p.user_id
      ORDER BY 
        p.updated_at DESC
    `);
    
    return NextResponse.json({ residents });
  } catch (error) {
    console.error('Error fetching residents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch residents from database' },
      { status: 500 }
    );
  }
} 

export async function DELETE(request) {
  try {
    // Get the resident ID from the URL
    const path = request.nextUrl.pathname;
    const id = path.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'No resident ID provided' }, { status: 400 });
    }
    // Delete from user_profiles first (if exists)
    await executeQuery('DELETE FROM user_profiles WHERE user_id = ?', [id]);
    // Delete from users table
    await executeQuery('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting resident:', error);
    return NextResponse.json({ error: 'Failed to delete resident' }, { status: 500 });
  }
} 