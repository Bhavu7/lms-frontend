import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import BookForm from '../components/BookForm';
import { useAuth } from '../contexts/AuthContext';

export default function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch {
      setError('Failed to load books');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch {
      setError('Failed to delete book');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-8">
      <h2 className="mb-6 text-3xl font-bold text-indigo-800">Books</h2>
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      {(user.role === 'Admin' || user.role === 'Librarian') && (
        <BookForm
          categories={categories}
          editingBook={editingBook}
          onSave={() => {
            setEditingBook(null);
            fetchBooks();
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-indigo-200 text-indigo-900">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Title</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Author</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Category</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Stock</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-100 text-indigo-900">
            {books.map(book => (
              <tr key={book._id} className="hover:bg-indigo-100">
                <td className="px-6 py-4">{book.title}</td>
                <td className="px-6 py-4">{book.author}</td>
                <td className="px-6 py-4">{book.category?.category_name || 'N/A'}</td>
                <td className="px-6 py-4 text-center">{book.stock}</td>
                <td className="px-6 py-4 flex justify-center space-x-3">
                  {(user.role === 'Admin' || user.role === 'Librarian') && (
                    <>
                      <button
                        onClick={() => setEditingBook(book)}
                        className="rounded bg-yellow-400 px-3 py-1 font-semibold text-white hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      {user.role === 'Admin' && (
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="rounded bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-6 py-4 text-indigo-700">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
