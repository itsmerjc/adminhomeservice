'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface DashboardStats {
  residents: number;
  providers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        
        const data = await response.json();
        if (data.stats) {
          console.log('Setting stats:', data.stats);
          setStats(data.stats);
        } else {
          console.error('No stats data in response:', data);
          setError('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">Dashboard</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md flex items-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-black border-r-transparent mr-2"></div>
              <span className="text-gray-700">Loading...</span>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md flex items-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-black border-r-transparent mr-2"></div>
              <span className="text-gray-700">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border  shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-black">Resident Accounts</h2>
              <div className="text-4xl font-bold mb-2 text-black">{stats?.residents || 0}</div>
              <Link href="/residents" className="mt-4 inline-block text-sm text-[#1a5f7a] hover:text-[#2c88aa]">
                View all residents →
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-black">Service Providers</h2>
              <div className="text-4xl font-bold mb-2 text-black">{stats?.providers || 0}</div>
              <Link href="/providers" className="mt-4 inline-block text-sm text-[#1a5f7a] hover:text-[#2c88aa]">
                View all providers →
              </Link>
            </div>
          </div>
        )}
        
        <Navbar />
      </div>
    </div>
  );
} 