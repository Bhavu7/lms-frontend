import React, { useEffect, useState } from "react";
import api from "../utils/api";
import BookForm from "../components/BookForm";
import { useAuth } from "../contexts/AuthContext";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";

export default function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/books");
      setBooks(data);
    } catch {
      setError("Failed to load books");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch {
      setError("Failed to delete book");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      <h1 className="text-3xl font-bold mb-6">Books</h1>

      {(user.role === "Admin" || user.role === "Librarian") && (
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

      <table className="w-full table-auto mt-8 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-indigo-100">
            <th className="border border-gray-300 p-2 text-left">Title</th>
            <th className="border border-gray-300 p-2 text-left">Author</th>
            <th className="border border-gray-300 p-2 text-left">Category</th>
            <th className="border border-gray-300 p-2 text-left">Stock</th>
            {(user.role === "Admin" || user.role === "Librarian") && (
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book._id} className="hover:bg-indigo-50">
                <td className="border border-gray-300 p-2">{book.title}</td>
                <td className="border border-gray-300 p-2">{book.author}</td>
                <td className="border border-gray-300 p-2">
                  {book.category?.category_name || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">{book.stock}</td>
                {(user.role === "Admin" || user.role === "Librarian") && (
                  <td className="border border-gray-300 p-2 space-x-3">
                    <button
                      onClick={() => setEditingBook(book)}
                      aria-label="Edit Book"
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <FiEdit size={20} />
                    </button>
                    {user.role === "Admin" && (
                      <button
                        onClick={() => handleDelete(book._id)}
                        aria-label="Delete Book"
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={user.role === "Admin" || user.role === "Librarian" ? 5 : 4}
                className="p-4 text-center italic text-gray-500"
              >
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
