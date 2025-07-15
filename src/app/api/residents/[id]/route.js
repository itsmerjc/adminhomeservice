import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../config/db.js';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
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