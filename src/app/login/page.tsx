'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      {/* Title Content */}
      <div className="text-white text-center mb-8 relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-24 h-24">
          <Image
            src="/thelogo.jpg"
            alt="Barangay Logo"
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>
        <div className="pt-20">
          <h1 className="text-4xl font-bold mb-2">SANGGUNIANG BARANGAY NG</h1>
          <h1 className="text-6xl font-bold mb-2">CARSADANG BAGO 1</h1>
          <h2 className="text-2xl">LUNGSOD NG IMUS, LALAWIGAN NG CAVITE</h2>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-black mb-6">ADMIN LOGIN</h3>
        <form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
            />
          </div>
          <div>
            <Link href="/dashboard">
              <button
                type="button"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
              >
                Log In
              </button>
            </Link>
          </div>
        </form>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 flex gap-4">
        <Link href="/about">
          <button className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded text-sm text-black">About</button>
        </Link>
        <Link href="/terms">
          <button className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded text-sm text-black">Terms & Conditions</button>
        </Link>
      </div>
    </div>
  );
} 