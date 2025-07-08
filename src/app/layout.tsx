import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barangay Carsadang Bago 1",
  description: "Barangay Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Main content wrapper with background */}
        <div 
          className="flex-1 relative"
          style={{
            backgroundImage: 'url(/images/bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Green overlay */}
          <div className="absolute inset-0 bg-green-600 opacity-80"></div>
          
          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Green header bar */}
            <div className="h-8 bg-green-600 text-white text-center text-sm flex items-center justify-end px-4">
              <Link href="/login">
                <button className="px-4 py-1 bg-white/20 hover:bg-white/30 rounded-md text-white hover:text-white font-medium transition-colors duration-200 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </Link>
            </div>

            {/* Main content area */}
            <div className="flex-1">
              {children}
            </div>

            {/* Blue footer bar */}
            <div className="h-8 bg-blue-900 text-white text-center text-sm flex items-center justify-center">
              All Rights Reserved 2024
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
