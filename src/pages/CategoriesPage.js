import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await api.post("/categories", { category_name: newCategory });
      setNewCategory("");
      fetchCategories();
      setError("");
    } catch {
      setError("Failed to add category");
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/categories/${id}`, { category_name: editName });
      setEditCategoryId(null);
      fetchCategories();
      setError("");
    } catch {
      setError("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      setError("Failed to delete category");
    }
  };

  return (
    <motion.div
      className="container mx-auto p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      {user.role === "Admin" && (
        <div className="mb-6 flex space-x-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-grow rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAdd}
            className="rounded bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      )}

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-indigo-100">
            <th className="border border-gray-300 p-2 text-left">Category Name</th>
            {user.role === "Admin" && (
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map(({ _id, category_name }) => (
              <tr key={_id} className="hover:bg-indigo-50">
                <td className="border border-gray-300 p-2">
                  {editCategoryId === _id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                  ) : (
                    category_name
                  )}
                </td>
                {user.role === "Admin" && (
                  <td className="border border-gray-300 p-2 space-x-2">
                    {editCategoryId === _id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(_id)}
                          className="text-green-600 font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditCategoryId(null)}
                          className="text-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditCategoryId(_id);
                            setEditName(category_name);
                          }}
                          className="text-indigo-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(_id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user.role === "Admin" ? 2 : 1} className="p-4 italic text-center">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
