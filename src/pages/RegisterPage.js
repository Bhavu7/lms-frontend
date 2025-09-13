import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member',
    memberType: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-700 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 px-4 py-3 text-red-700">{error}</div>
        )}

        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="John Doe"
        />

        <label
          htmlFor="email"
          className="mt-6 block text-sm font-semibold text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="you@example.com"
        />

        <label
          htmlFor="password"
          className="mt-6 block text-sm font-semibold text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={form.password}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your password"
        />

        <label
          htmlFor="role"
          className="mt-6 block text-sm font-semibold text-gray-700"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Member">Member</option>
          <option value="Librarian">Librarian</option>
          <option value="Admin">Admin</option>
        </select>

        <label
          htmlFor="memberType"
          className="mt-6 block text-sm font-semibold text-gray-700"
        >
          Member Type (optional)
        </label>
        <input
          id="memberType"
          name="memberType"
          type="text"
          value={form.memberType}
          onChange={handleChange}
          className="mt-1 mb-4 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Optional member type"
        />

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-indigo-600 py-3 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
}
