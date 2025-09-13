import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function BookForm({ categories, editingBook, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    stock: 1,
    coverImage: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title || '',
        author: editingBook.author || '',
        category: editingBook.category?._id || '',
        stock: editingBook.stock || 1,
        coverImage: null,
      });
    } else {
      setForm({
        title: '',
        author: '',
        category: '',
        stock: 1,
        coverImage: null,
      });
    }
  }, [editingBook]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'coverImage') {
      setForm(prev => ({ ...prev, coverImage: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('author', form.author);
      data.append('category', form.category);
      data.append('stock', form.stock);
      if (form.coverImage) data.append('coverImage', form.coverImage);

      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/books', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSave();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-6 text-2xl font-semibold text-gray-800">
        {editingBook ? 'Edit Book' : 'Add Book'}
      </h3>

      {error && (
        <p className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Book title"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">Author</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Author name"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">Stock</label>
          <input
            name="stock"
            type="number"
            min="1"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Stock quantity"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">Cover Image</label>
          <input
            name="coverImage"
            type="file"
            onChange={handleChange}
            accept="image/*"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2 font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {editingBook ? 'Update' : 'Add'}
        </button>

        {editingBook && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
