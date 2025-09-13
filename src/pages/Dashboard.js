import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-100 p-8">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Library Management System
        </h1>
        <button
          onClick={logout}
          className="rounded-md bg-red-600 px-5 py-2 text-white shadow hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <p className="mb-6 text-lg font-semibold text-gray-800">
        Welcome, <span className="text-indigo-700">{user?.id || 'User'}</span>! Role:{' '}
        <span className="font-bold text-indigo-900">{user?.role}</span>
      </p>

      <nav className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl">
        <Link
          to="/books"
          className="rounded-lg bg-white p-10 text-center shadow hover:bg-indigo-50"
        >
          <span className="text-xl font-semibold text-indigo-600">Manage Books</span>
        </Link>
        <Link
          to="/categories"
          className="rounded-lg bg-white p-10 text-center shadow hover:bg-green-50"
        >
          <span className="text-xl font-semibold text-green-600">Manage Categories</span>
        </Link>
        <Link
          to="/transactions"
          className="rounded-lg bg-white p-10 text-center shadow hover:bg-yellow-50"
        >
          <span className="text-xl font-semibold text-yellow-600">My Transactions</span>
        </Link>

        {user?.role === 'Admin' && (
          <Link
            to="/users"
            className="rounded-lg bg-white p-10 text-center shadow hover:bg-purple-50"
          >
            <span className="text-xl font-semibold text-purple-600">Manage Users</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
