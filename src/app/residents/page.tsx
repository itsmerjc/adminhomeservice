'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface Resident {
  id: number;
  email: string;
  name: string;
  address: string;
  phone: string;
  updated_at: string;
}

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/residents');
        
        if (!response.ok) {
          throw new Error('Failed to fetch residents');
        }
        
        const data = await response.json();
        setResidents(data.residents);
      } catch (error) {
        console.error('Error fetching residents:', error);
        setError('Failed to load resident data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Resident Accounts</h1>
        
        <Navbar />

        {loading ? (
          <div className="mt-6 flex justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1a5f7a] border-r-transparent align-[-0.125em]"></div>
            <p className="ml-2 text-black">Loading resident data...</p>
          </div>
        ) : error ? (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        ) : residents.length === 0 ? (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 text-gray-700 rounded-md">
            No resident accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Address</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 border-b">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {residents.map((resident) => (
                  <tr key={resident.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{resident.name || 'Not provided'}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{resident.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{resident.address || 'Not provided'}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{resident.phone || 'Not provided'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-white text-[#1a5f7a] border border-[#1a5f7a] rounded-md hover:bg-gray-50 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 