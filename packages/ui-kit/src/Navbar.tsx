"use client";

import * as React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold">SynapseFI</a>
        <div>
          {isAuthenticated ? (
            <>
              <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Dashboard</a>
              <a href="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Profile</a>
              <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Login</a>
              <a href="/signup" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
