import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await api.post('/categories', { category_name: newCategory });
      setNewCategory('');
      fetchCategories();
      setError('');
    } catch {
      setError('Failed to add category');
    }
  };

  const handleEdit = (id, name) => {
    setEditCategoryId(id);
    setEditName(name);
  };

  const handleUpdate = async id => {
    if (!editName.trim()) return;
    try {
      await api.put(`/categories/${id}`, { category_name: editName });
      setEditCategoryId(null);
      fetchCategories();
      setError('');
    } catch {
      setError('Failed to update category');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      setError('Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-8 max-w-lg mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-green-800">Categories</h2>
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      {user.role === 'Admin' && (
        <div className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="flex-grow rounded border border-green-400 px-4 py-2 focus:border-green-600 focus:ring-green-600"
          />
          <button
            onClick={handleAdd}
            className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
          >
            Add
          </button>
        </div>
      )}

      <ul className="space-y-3 rounded bg-white p-6 shadow">
        {categories.length === 0 && (
          <li className="text-center text-green-700">No categories found.</li>
        )}
        {categories.map(cat => (
          <li key={cat._id} className="flex items-center justify-between border-b border-green-200 pb-2 last:border-b-0">
            {editCategoryId === cat._id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="mr-3 flex-grow rounded border border-green-400 px-3 py-1 focus:border-green-600 focus:ring-green-600"
                />
                <button
                  onClick={() => handleUpdate(cat._id)}
                  className="rounded bg-blue-600 px-4 py-1 font-semibold text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCategoryId(null)}
                  className="ml-3 rounded bg-gray-300 px-4 py-1 font-semibold text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-green-700">{cat.category_name}</span>
                {user.role === 'Admin' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(cat._id, cat.category_name)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
