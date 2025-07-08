'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-blue-900 p-4 rounded-lg">
      <div className="flex items-center">
        <Image 
          src="/thelogo.jpg" 
          alt="Logo" 
          width={40} 
          height={40} 
          className="rounded-full"
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Link href="/providers/add">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Add Provider
          </button>
        </Link>
        
        <Link href="/residents">
          <button className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
            View Residents
          </button>
        </Link>
        
        <Link href="/providers">
          <button className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
            View Providers
          </button>
        </Link>
      </div>
    </nav>
  );
}