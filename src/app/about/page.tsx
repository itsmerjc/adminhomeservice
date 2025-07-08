'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/images/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Green overlay */}
      <div className="absolute inset-0 bg-green-600 opacity-80"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-8">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/thelogo.jpg"
            alt="CasaServ Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        {/* White Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-4xl w-full">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-8 text-center text-black">About CasaServ</h1>

          {/* Main Content */}
          <div className="space-y-6 text-black text-center">
            <p>
              CasaServ is an online and mobile application designed to speed up delivery and management of home services in
              Barangay Carsadang Bago 1, Legian 2, Imus City, Cavite. It equips the barangay staff and administration with the
              capability to manage, monitor, and oversee service providers, attend to residents' requests, and facilitate speedy and
              efficient service delivery.
            </p>

            <p>
              The platform is a conduit between residents and verified service providers, encouraging accessibility, openness,
              and accountability at the barangay level for services like plumbing, electrical works, cleaning, maintenance,
              and others.
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Mission:</h2>
              <p>To deliver effective, secure, and affordable digital services to all Barangay Carsadang Bago 1 residents.</p>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Vision:</h2>
              <p>An interconnected barangay where technology supports service provision and people's participation.</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <Link href="/login">
              <button className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 