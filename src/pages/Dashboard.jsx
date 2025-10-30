import React, { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { MonthlyTrendChart } from "@/components/charts/MonthlyTrendChart";
import UpdateTransactionModal from "@/components/UpdateTransactionModel";
import AddTransactionModal from "@/components/AddTransactionModel";
import {
  MoreVertical,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShoppingBag,
  Car,
  Utensils,
  Home,
  Gift,
  Building,
  DollarSign,
  ChevronDown,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setTransactions(data.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }, [user, getToken]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTransactionSaved = async () => {
    await fetchTransactions();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const token = await getToken();
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTransactions();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/export/${user.id}`
      );
      if (!res.ok) throw new Error("Failed to export transactions");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  const categoryIcons = {
    Salary: <Building className="w-5 h-5 text-green-600" />,
    "Bills & Utilities": <Home className="w-5 h-5 text-blue-600" />,
    Transportation: <Car className="w-5 h-5 text-orange-500" />,
    "Food & Dining": <Utensils className="w-5 h-5 text-yellow-500" />,
    Shopping: <ShoppingBag className="w-5 h-5 text-pink-500" />,
    Entertainment: <Gift className="w-5 h-5 text-purple-500" />,
    Default: <Wallet className="w-5 h-5 text-gray-400" />,
  };

  const categoryData = Object.values(
    transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => {
        if (!acc[tx.category])
          acc[tx.category] = { category: tx.category, amount: 0 };
        acc[tx.category].amount += tx.amount;
        return acc;
      }, {})
  );

  const monthlyData = Object.values(
    transactions.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", { month: "short" });
      if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
      tx.type === "income"
        ? (acc[month].income += tx.amount)
        : (acc[month].expense += tx.amount);
      return acc;
    }, {})
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const filteredTransactions = transactions
    .filter(
      (t) =>
        (t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterCategory ? t.category === filterCategory : true)
    )
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
      if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOption === "amount-high") return b.amount - a.amount;
      if (sortOption === "amount-low") return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary/90">
              Welcome, {user?.firstName || "User"}
            </h1>
            <p className="text-gray-600 mt-1">Here's your financial overview.</p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border rounded-xl shadow cursor-pointer hover:bg-gray-100 transition w-full sm:w-auto justify-center"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/90 text-white rounded-xl shadow cursor-pointer hover:bg-gray-700 transition w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
            <div>
              <p className="text-primary/90 text-lg">Total Income</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                ₹{totalIncome.toLocaleString()}
              </h2>
            </div>
            <ArrowUpRight className="w-8 h-8 text-green-500" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
            <div>
              <p className="text-primary/90 text-lg">Total Expenses</p>
              <h2 className="text-3xl font-bold text-red-500 mt-2">
                ₹{totalExpenses.toLocaleString()}
              </h2>
            </div>
            <ArrowDownRight className="w-8 h-8 text-red-500" />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
            <div>
              <p className="text-primary/90 text-lg">Total Balance</p>
              <h2 className={`text-3xl text-gray-800 font-bold mt-2`} >
                ₹{balance.toLocaleString()}
              </h2>
            </div>
            <DollarSign className="w-8 h-8 text-gray-800" />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-3 flex justify-center items-center">
            <CategoryPieChart data={categoryData} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-3 flex justify-center items-center">
            <MonthlyTrendChart data={monthlyData} />
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
            <h2 className="text-2xl font-bold text-primary/90 text-center sm:text-left">
              Transaction History
            </h2>

            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
              <div className="relative w-full sm:w-auto max-w-[350px]">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-400 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort + Filter (side by side) */}
              <div className="flex items-center justify-end sm:justify-end gap-2">
                {/* Sort */}
                <div className="relative sm:w-auto">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-primary/90 rounded-lg hover:bg-gray-200 transition shadow-sm w-full sm:w-auto justify-center"
                  >
                    <ArrowUpDown className="w-4 h-4" /> Sort
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20">
                      {[
                        { value: "newest", label: "Newest" },
                        { value: "oldest", label: "Oldest" },
                        { value: "amount-high", label: "High → Low" },
                        { value: "amount-low", label: "Low → High" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortOption(opt.value);
                            setShowSortMenu(false);
                          }}
                          className={`block w-full text-center px-4 py-2 text-sm hover:bg-gray-50 ${sortOption === opt.value ? "bg-gray-100 font-semibold" : ""
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter */}
                <div className="relative sm:w-auto">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-primary/90 rounded-lg hover:bg-gray-200 transition shadow-sm w-full sm:w-auto justify-center"
                  >
                    <Filter className="w-4 h-4" /> Filter
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20">
                      <button
                        onClick={() => {
                          setFilterCategory("");
                          setShowFilterMenu(false);
                        }}
                        className={`block w-full text-center px-4 py-2 text-sm hover:bg-gray-50 ${filterCategory === "" ? "bg-gray-100 font-semibold" : ""
                          }`}
                      >
                        All
                      </button>
                      {[...new Set(transactions.map((t) => t.category))].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setFilterCategory(cat);
                            setShowFilterMenu(false);
                          }}
                          className={`block w-full text-center px-4 py-2 text-sm hover:bg-gray-50 ${filterCategory === cat ? "bg-gray-100 font-semibold" : ""
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="divide-y">
            {filteredTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions found.</p>
            ) : (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between px-4 items-center py-4 hover:bg-gray-50 rounded transition"
                >
                  <div className="flex items-center gap-3">
                    {categoryIcons[tx.category] || categoryIcons.Default}
                    <div>
                      <h3 className="font-medium text-gray-800">{tx.title}</h3>
                      <p className="text-xs text-gray-500">
                        {tx.category} • {new Date(tx.date).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                    </span>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setDropdownOpen(dropdownOpen === tx.id ? null : tx.id)
                        }
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {dropdownOpen === tx.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-32 z-20">
                          <button
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setIsUpdateModalOpen(true);
                              setDropdownOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary/90 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" /> Update
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(tx.id);
                              setDropdownOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTransactionSaved={handleTransactionSaved}
      />
      <UpdateTransactionModal
        isOpen={isUpdateModalOpen}
        transaction={selectedTransaction}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedTransaction(null);
        }}
        onTransactionSaved={handleTransactionSaved}
      />
    </div>
  );
}
