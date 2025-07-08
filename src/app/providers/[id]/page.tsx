'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';

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
  services: Service[];
}

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`/api/providers/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Provider not found');
          }
          throw new Error('Failed to fetch provider');
        }
        
        const data = await response.json();
        setProvider(data.provider);
      } catch (err: any) {
        setError(err.message || 'Error fetching provider details');
        console.error('Error fetching provider:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProvider();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this provider?')) {
      return;
    }

    try {
      const response = await fetch(`/api/providers/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete provider');
      }

      router.push('/providers');
    } catch (err: any) {
      alert(err.message || 'Error deleting provider');
      console.error('Error deleting provider:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black">Provider Details</h1>
          <Navbar />
          <div className="mt-6 text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1a5f7a] border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-gray-700">Loading provider details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-black">Provider Details</h1>
          <Navbar />
          <div className="p-4 mt-6 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error || 'Provider not found'}
          </div>
          <div className="mt-6">
            <Link href="/providers">
              <button className="px-4 py-2 bg-white text-[#1a5f7a] border border-[#1a5f7a] rounded-md hover:bg-gray-50 transition-colors">
                Back to Providers
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Provider Details</h1>
        
        <Navbar />
        
        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center">
              {provider.logo_url && (
                <div className="mb-4 md:mb-0 md:mr-6 w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                  <Image 
                    src={provider.logo_url} 
                    alt={provider.name}
                    width={80}
                    height={80}
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-black">{provider.name}</h2>
                <p className="text-gray-600">Contact: {provider.contact}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex justify-end">
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                >
                  Delete Provider
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-black">Services Offered</h3>
              
              {provider.services.length === 0 ? (
                <p className="text-gray-600">No services listed for this provider.</p>
              ) : (
                <div className="grid gap-4">
                  {provider.services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-black">{service.name}</h4>
                          <p className="text-lg font-medium text-black">${service.price}</p>
                        </div>
                      </div>
                      
                      {service.description && (
                        <div className="mt-2">
                          <p className="text-gray-700">{service.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link href="/providers">
            <button className="px-4 py-2 bg-white text-black border border-black rounded-md hover:bg-gray-100 transition-colors">
              Back to Providers
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 