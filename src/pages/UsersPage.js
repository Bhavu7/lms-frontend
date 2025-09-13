import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roleUpdates, setRoleUpdates] = useState({});
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      setError('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (id, newRole) => {
    setRoleUpdates(prev => ({ ...prev, [id]: newRole }));
  };

  const handleUpdateRole = async id => {
    try {
      await api.put('/users/role', { userId: id, newRole: roleUpdates[id] });
      fetchUsers();
      setError('');
    } catch {
      setError('Failed to update role');
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8 max-w-5xl mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-purple-800">Manage Users</h2>
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-purple-900">
          <thead className="bg-purple-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Name</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Email</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Role</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100">
            {users.map(user => {
              const currentRole = roleUpdates[user._id] ?? user.role;
              return (
                <tr key={user._id} className="hover:bg-purple-100">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={currentRole}
                      onChange={e => handleRoleChange(user._id, e.target.value)}
                      className="rounded border border-purple-400 px-3 py-1 focus:border-purple-600 focus:ring-purple-600"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Librarian">Librarian</option>
                      <option value="Member">Member</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUpdateRole(user._id)}
                      disabled={currentRole === user.role}
                      className={`rounded px-4 py-2 font-semibold text-white ${
                        currentRole === user.role
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-purple-700">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
