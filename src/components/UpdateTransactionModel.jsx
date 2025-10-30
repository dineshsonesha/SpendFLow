import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import RadioOption from "./RadioOption";

export default function UpdateTransactionModal({ isOpen, onClose, transaction, onTransactionSaved }) {
  const [transactionType, setTransactionType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (transaction) {
      setTransactionType(transaction.type);
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setDate(transaction.date?.split("T")[0]);
      setDescription(transaction.description || "");
    }
  }, [transaction]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      if (!user) throw new Error("User not found");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          amount: parseFloat(amount),
          type: transactionType,
          category,
          date,
          description: description.trim(),
          userId: user.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to update transaction");
      const data = await res.json();

      onTransactionSaved?.(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative border border-gray-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Update Transaction
        </h2>

        {/* ✅ same UI form reused */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="flex items-center gap-6">
              <RadioOption
                value="income"
                label="Income"
                checked={transactionType === "income"}
                onChange={() => setTransactionType("income")}
                type="income"
              />
              <RadioOption
                value="expense"
                label="Expense"
                checked={transactionType === "expense"}
                onChange={() => setTransactionType("expense")}
                type="expense"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select category</option>
                <option>Food & Dining</option>
                <option>Transportation</option>
                <option>Salary</option>
                <option>Bills & Utilities</option>
                <option>Shopping</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date
            </label>
            <div className="absolute inset-y-0 left-0 top-7 flex items-center pl-3 text-gray-400 pointer-events-none">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
