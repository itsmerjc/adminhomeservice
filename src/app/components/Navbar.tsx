'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#1a5f7a] p-4 rounded-lg">
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
          <button className="px-4 py-2 bg-[#2c88aa] text-white rounded-md hover:bg-[#236d89] transition-colors">
            Add Provider
          </button>
        </Link>
        
        <Link href="/residents">
          <button className="px-4 py-2 bg-white text-[#1a5f7a] border border-[#1a5f7a] rounded-md hover:bg-gray-50 transition-colors">
            View Residents
          </button>
        </Link>
        
        <Link href="/providers">
          <button className="px-4 py-2 bg-white text-[#1a5f7a] border border-[#1a5f7a] rounded-md hover:bg-gray-50 transition-colors">
            View Providers
          </button>
        </Link>
      </div>
    </nav>
  );
}