import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-700 px-4 p-6"
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-10 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Sign in to your account</h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
            {error}
          </div>
        )}

        <Input
          icon={FiMail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          icon={FiLock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 mt-6 rounded font-semibold hover:bg-indigo-700 transition"
        >
          Sign in
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

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
