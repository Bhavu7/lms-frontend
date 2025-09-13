import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch {
      setError('Failed to fetch transactions');
    }
  };

  const handleReturn = async transactionId => {
    if (!window.confirm('Confirm return of this book?')) return;
    try {
      await api.post('/transactions/return', { transactionId });
      fetchTransactions();
    } catch {
      setError('Failed to return book');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 p-8 max-w-4xl mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-yellow-800">My Transactions</h2>
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-yellow-900">
          <thead className="bg-yellow-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold uppercase">Book Title</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Borrow Date</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Return Date</th>
              <th className="px-6 py-3 text-left font-semibold uppercase">Fine</th>
              <th className="px-6 py-3 text-center font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yellow-100">
            {transactions.map(tx => (
              <tr key={tx._id} className="hover:bg-yellow-100">
                <td className="px-6 py-4">{tx.book?.title || 'Unknown'}</td>
                <td className="px-6 py-4">{new Date(tx.borrowDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">{tx.returnDate ? new Date(tx.returnDate).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">{tx.fine || 0}</td>
                <td className="px-6 py-4 text-center">
                  {!tx.returnDate && (
                    <button
                      onClick={() => handleReturn(tx._id)}
                      className="rounded bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700"
                    >
                      Return Book
                    </button>
                  )}
                  {tx.returnDate && <span>-</span>}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-yellow-700">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
