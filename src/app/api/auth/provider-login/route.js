import { NextResponse } from 'next/server';
import { verifyProviderCredentials, getProviderById } from '../../providers/providerService.js';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    console.log('Attempting login with username:', username);
    
    // Verify credentials - returns provider ID if successful, false otherwise
    const providerId = await verifyProviderCredentials(username, password);
    
    if (providerId) {
      // Get provider data (excluding password)
      const provider = await getProviderById(providerId);
      
      if (!provider) {
        return NextResponse.json(
          { error: 'Provider not found' },
          { status: 404 }
        );
      }
      
      console.log('Login successful for provider:', provider.name);
      
      // Return success with provider info
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        provider
      });
    } else {
      console.log('Login failed: Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error during provider login:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 