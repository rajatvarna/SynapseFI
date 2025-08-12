import * as React from 'react';

export const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold">SynapseFI</a>
        <div>
          <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Dashboard</a>
          <a href="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Profile</a>
          <a href="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Login</a>
        </div>
      </div>
    </nav>
  );
};
