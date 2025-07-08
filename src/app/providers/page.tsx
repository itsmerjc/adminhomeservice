'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface Provider {
  id: number;
  name: string;
  contact: string;
  logo_url: string | null;
  business_type: string;
  services?: Service[];
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/providers');
        if (!response.ok) {
          throw new Error('Failed to fetch providers');
        }
        
        const data = await response.json();
        setProviders(data.providers || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching providers');
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this provider?')) {
      return;
    }

    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete provider');
      }

      // Remove the deleted provider from the state
      setProviders(providers.filter(provider => provider.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting provider');
      console.error('Error deleting provider:', err);
    }
  };

  // Function to get main service or default message
  const getMainService = (provider: Provider) => {
    if (!provider.services || provider.services.length === 0) {
      return 'No services listed';
    }
    
    return provider.services[0].name;
  };

  // Function to get price of main service or default message
  const getMainPrice = (provider: Provider) => {
    if (!provider.services || provider.services.length === 0) {
      return '-';
    }
    
    return `$${provider.services[0].price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Service Providers</h1>
        
        <Navbar />

        {error && (
          <div className="p-4 mt-6 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-6 text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-gray-700">Loading providers...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="mt-6 text-center py-10 border border-gray-200 rounded-lg">
            <p className="text-gray-700">No providers found.</p>
            <Link href="/providers/add">
              <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Add Your First Provider
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Business Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Service</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900 flex items-center">
                      {provider.logo_url && (
                        <div className="mr-3 w-8 h-8 relative overflow-hidden rounded-full bg-gray-100">
                          <Image 
                            src={provider.logo_url} 
                            alt={provider.name}
                            width={32}
                            height={32}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      {provider.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{provider.business_type}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{getMainService(provider)}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{getMainPrice(provider)}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      <Link href={`/providers/${provider.id}`}>
                        <button className="text-black hover:text-gray-800 mr-2">View</button>
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(provider.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 