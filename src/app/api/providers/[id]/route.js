import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../config/db.js';
import { getProviderById } from '../providerService.js';

// Define the fetch function for the API route with proper params handling
export async function GET(request) {
  try {
    // Access id directly from URL path
    const path = request.nextUrl.pathname;
    const id = path.split('/').pop();
    
    const provider = await getProviderById(id);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ provider });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    );
  }
}

// Define the delete function for the API route with proper params handling
export async function DELETE(request) {
  try {
    // Access id directly from URL path
    const path = request.nextUrl.pathname;
    const id = path.split('/').pop();
    
    // Check if provider exists
    const [provider] = await executeQuery('SELECT * FROM providers WHERE id = ?', [id]);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    // Delete the provider (cascades to services due to foreign key constraint)
    await executeQuery('DELETE FROM providers WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting provider:', error);
    return NextResponse.json(
      { error: 'Failed to delete provider' },
      { status: 500 }
    );
  }
} 