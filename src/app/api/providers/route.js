import { NextResponse } from 'next/server';
import { createProvider, addService, getProviders } from './providerService.js';
import initializeDatabase from '../../../config/init-db.js';

// Initialize the database when the API is first loaded
(async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    // Do not continue in mock mode, just log the error
  }
})();

export async function GET() {
  try {
    const providers = await getProviders();
    return NextResponse.json({ providers });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers from database' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, contact, email, password, logoUrl, services, businessType } = data;
    
    console.log('Received provider creation request:', { 
      name, 
      contact,
      email,
      businessType,
      hasPassword: !!password,
      hasLogoUrl: !!logoUrl
    });
    
    // Validate input data
    if (!name || !contact) {
      return NextResponse.json(
        { error: 'Provider name and contact are required' },
        { status: 400 }
      );
    }
    
    if (!email) {
      return NextResponse.json(
        { error: 'Provider email is required' },
        { status: 400 }
      );
    }
    
    if (!businessType) {
      return NextResponse.json(
        { error: 'Business type is required' },
        { status: 400 }
      );
    }
    
    // Create the provider
    const provider = await createProvider({ name, contact, email, logoUrl, password, businessType });
    
    console.log('Provider created:', {
      id: provider.id,
      name: provider.name,
      email: provider.email,
      contact: provider.contact
    });
    
    // Add services for the provider if any are provided
    const savedServices = [];
    if (services && Array.isArray(services)) {
      for (const service of services) {
        const { name: serviceName, price, description } = service;
        
        if (!serviceName || !price) {
          continue; // Skip invalid services
        }
        
        const savedService = await addService({
          providerId: provider.id,
          name: serviceName,
          price: parseFloat(price),
          description
        });
        
        savedServices.push(savedService);
      }
    }
    
    // Ensure email is included in the response
    const providerResponse = {
      ...provider,
      services: savedServices
    };
    
    console.log('Returning provider data:', {
      id: providerResponse.id,
      name: providerResponse.name,
      email: providerResponse.email,
      servicesCount: savedServices.length
    });
    
    return NextResponse.json({ 
      success: true,
      provider: providerResponse
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating provider:', error);
    return NextResponse.json(
      { error: 'Failed to create provider in database. Please check your connection.' },
      { status: 500 }
    );
  }
} 