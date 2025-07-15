import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import HeaderBar from "./components/HeaderBar";

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
            <HeaderBar />

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
