'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-8 text-center text-black">Terms & Conditions (Admin & Staff Use)</h1>

          {/* Main Content */}
          <div className="space-y-6 text-black w-full">
            <ol className="list-decimal space-y-6 pl-5">
              <li>
                <h2 className="font-bold text-lg">User Access</h2>
                <p>Only authorized Barangay Admins and staff with valid credentials may use the system.</p>
              </li>

              <li>
                <h2 className="font-bold text-lg">Responsibilities</h2>
                <p>Admins must manage records accurately, respond to resident requests promptly, and work only with verified service providers while ensuring data privacy.</p>
              </li>

              <li>
                <h2 className="font-bold text-lg">Confidentiality</h2>
                <p>All system data is confidential. Unauthorized access, sharing, or misuse of data is strictly prohibited.</p>
              </li>

              <li>
                <h2 className="font-bold text-lg">Proper Use</h2>
                <p>The system must only be used for official barangay purposes. Misuse or unauthorized access is not allowed.</p>
              </li>

              <li>
                <h2 className="font-bold text-lg">Monitoring</h2>
                <p>All user actions are monitored and logged for security and quality assurance.</p>
              </li>

              <li>
                <h2 className="font-bold text-lg">Support & Maintenance</h2>
                <p>System updates and support are provided regularly. Issues must be reported to the IT team.</p>
              </li>

              <li>
                <h2 className="font-bold text-lg">Violations</h2>
                <p>Breaking any rule may lead to account suspension, disciplinary action, or legal consequences.</p>
              </li>
            </ol>
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