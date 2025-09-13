import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiCheckSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
    memberType: "",
  });
  const [error, setError] = useState("");

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-700 px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg"
      >
        <h2 className="text-center text-3xl font-semibold text-gray-900 mb-8">
          Create Your Account
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-red-100 text-red-700 rounded"
          >
            {error}
          </motion.div>
        )}

        <Input icon={FiUser} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <Input icon={FiMail} name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
        <Input icon={FiLock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

        <label className="block mb-6">
          <span className="text-gray-700 font-semibold mb-1 flex items-center">
            <FiCheckSquare className="mr-2" /> Role
          </span>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>Member</option>
            <option>Librarian</option>
            <option>Admin</option>
          </select>
        </label>

        <input
          name="memberType"
          placeholder="Member Type (optional)"
          value={form.memberType}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded font-semibold shadow hover:bg-indigo-700 transition-colors"
        >
          Register
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

// Reusable Input component with icon
function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative mb-6">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      )}
      <input
        {...props}
        className="w-full rounded border border-gray-300 pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
