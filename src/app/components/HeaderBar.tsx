"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderBar() {
  const pathname = usePathname();
  // List of public routes where logout should be hidden
  const hideLogout = pathname === "/login" || pathname === "/provider-login";

  return (
    <div className="h-8 bg-green-600 text-white text-center text-sm flex items-center justify-end px-4">
      {!hideLogout && (
        <Link href="/login">
          <button className="px-4 py-1 bg-white/20 hover:bg-white/30 rounded-md text-white hover:text-white font-medium transition-colors duration-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </Link>
      )}
    </div>
  );
} 