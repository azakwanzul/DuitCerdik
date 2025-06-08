import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, TrendingUp, PieChart, Target, AlertTriangle, RefreshCw, Download, Upload, Calculator, Brain, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

const DuitCerdik = () => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('MYR');
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({
    Food: 500,
    Transport: 200,
    Entertainment: 150,
    Shopping: 200,
    Bills: 300,
    Others: 150
  });
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: 'Emergency Fund', target: 5000, current: 1200, deadline: '2025-12-31' },
    { id: 2, name: 'Japan Trip', target: 3000, current: 800, deadline: '2025-09-30' }
  ]);
  // Add this after the savingsGoals state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    deadline: ''
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [lifestyleSimulator, setLifestyleSimulator] = useState({
    income: 2000,
    rent: 600,
    food: 400,
    transport: 200,
    entertainment: 150
  });

  // Form state for new transaction
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Food',
    amount: '',
    paymentMethod: 'Cash',
    needWant: 'Need',
    notes: ''
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Others'];
  const paymentMethods = ['Cash', 'Maybank', 'CIMB', 'GrabPay', 'Touch n Go', 'Credit Card'];

  const exchangeRates = {
    MYR: 1,
    USD: 0.21,
    SGD: 0.29
  };

  // Text translations
  const text = {
    en: {
      title: 'DuitCerdik',
      subtitle: 'Smart Personal Finance Tracker',
      dashboard: 'Dashboard',
      expenses: 'Expenses',
      budget: 'Budget',
      goals: 'Goals',
      simulator: 'Lifestyle Simulator',
      insights: 'Smart Insights',
      totalSpent: 'Total Spent This Month',
      budgetUsed: 'Budget Used',
      savingsGoals: 'Savings Goals',
      addExpense: 'Add Expense',
      category: 'Category',
      amount: 'Amount',
      paymentMethod: 'Payment Method',
      needWant: 'Need/Want',
      notes: 'Notes',
      need: 'Need',
      want: 'Want',
      save: 'Save',
      cancel: 'Cancel',
      reset: 'Reset All Data',
      export: 'Export Data',
      import: 'Import Data',
      weeklyTrend: 'Weekly Spending Trend',
      categoryBreakdown: 'Category Breakdown',
      behavioralInsights: 'Behavioral Insights',
      lifestyleSimTitle: 'What would your life look like with different budgets?',
      monthlyIncome: 'Monthly Income',
      rent: 'Rent',
      food: 'Food',
      transport: 'Transport',
      entertainment: 'Entertainment',
      surplus: 'Monthly Surplus'
    },
    bm: {
      title: 'DuitCerdik',
      subtitle: 'Penjejak Kewangan Peribadi Pintar',
      dashboard: 'Papan Pemuka',
      expenses: 'Perbelanjaan',
      budget: 'Bajet',
      goals: 'Matlamat',
      simulator: 'Simulator Gaya Hidup',
      insights: 'Wawasan Pintar',
      totalSpent: 'Jumlah Belanja Bulan Ini',
      budgetUsed: 'Bajet Digunakan',
      savingsGoals: 'Matlamat Simpanan',
      addExpense: 'Tambah Perbelanjaan',
      category: 'Kategori',
      amount: 'Jumlah',
      paymentMethod: 'Kaedah Bayaran',
      needWant: 'Keperluan/Kehendak',
      notes: 'Nota',
      need: 'Keperluan',
      want: 'Kehendak',
      save: 'Simpan',
      cancel: 'Batal',
      reset: 'Reset Semua Data',
      export: 'Eksport Data',
      import: 'Import Data',
      weeklyTrend: 'Trend Perbelanjaan Mingguan',
      categoryBreakdown: 'Pecahan Kategori',
      behavioralInsights: 'Wawasan Tingkah Laku',
      lifestyleSimTitle: 'Bagaimana kehidupan anda dengan bajet yang berbeza?',
      monthlyIncome: 'Pendapatan Bulanan',
      rent: 'Sewa',
      food: 'Makanan',
      transport: 'Pengangkutan',
      entertainment: 'Hiburan',
      surplus: 'Lebihan Bulanan'
    }
  };

  const t = text[language];

  // Calculated values
  const thisMonthTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
  }, [transactions]);

  const totalSpentThisMonth = useMemo(() => {
    return thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [thisMonthTransactions]);

  const categorySpending = useMemo(() => {
    const spending = {};
    categories.forEach(cat => spending[cat] = 0);
    
    thisMonthTransactions.forEach(t => {
      spending[t.category] = (spending[t.category] || 0) + t.amount;
    });
    
    return spending;
  }, [thisMonthTransactions]);

  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);
  const budgetUsagePercentage = (totalSpentThisMonth / totalBudget) * 100;

  // Weekly trend data
  const weeklyData = useMemo(() => {
    const weeks = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      const weekKey = `Week ${7-i}`;
      weeks[weekKey] = 0;
    }
    
    thisMonthTransactions.forEach(t => {
      const transactionDate = new Date(t.date);
      const daysDiff = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(daysDiff / 7);
      if (weekIndex >= 0 && weekIndex < 7) {
        const weekKey = `Week ${7-weekIndex}`;
        weeks[weekKey] += t.amount;
      }
    });
    
    return Object.entries(weeks).map(([week, amount]) => ({ week, amount }));
  }, [thisMonthTransactions]);

  // Pie chart data
  const pieData = Object.entries(categorySpending)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({ name: category, value: amount }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  // Behavioral insights
  const insights = useMemo(() => {
    const insights = [];
    
    // Budget warnings
    Object.entries(categorySpending).forEach(([category, amount]) => {
      const budget = budgets[category];
      const percentage = (amount / budget) * 100;
      
      if (percentage > 80) {
        insights.push({
          type: 'warning',
          message: `You've used ${percentage.toFixed(0)}% of your ${category} budget! Consider reducing spending.`,
          messageBM: `Anda telah guna ${percentage.toFixed(0)}% bajet ${category}! Pertimbang kurangkan perbelanjaan.`
        });
      }
    });
    
    // Spending pattern insights
    const weekendSpending = thisMonthTransactions
      .filter(t => {
        const date = new Date(t.date);
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const weekdaySpending = totalSpentThisMonth - weekendSpending;
    
    if (weekendSpending > weekdaySpending * 0.4) {
      insights.push({
        type: 'info',
        message: `You spend ${((weekendSpending/totalSpentThisMonth)*100).toFixed(0)}% of your budget on weekends. Plan ahead to avoid overspending!`,
        messageBM: `Anda belanja ${((weekendSpending/totalSpentThisMonth)*100).toFixed(0)}% bajet pada hujung minggu. Rancang dahulu!`
      });
    }
    
    // Need vs Want analysis
    const wantSpending = thisMonthTransactions
      .filter(t => t.needWant === 'Want')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (wantSpending > totalSpentThisMonth * 0.3) {
      insights.push({
        type: 'tip',
        message: `${((wantSpending/totalSpentThisMonth)*100).toFixed(0)}% of your spending is on "wants". That's RM${wantSpending.toFixed(2)} - imagine what else you could save for!`,
        messageBM: `${((wantSpending/totalSpentThisMonth)*100).toFixed(0)}% perbelanjaan anda adalah "kehendak". Itu RM${wantSpending.toFixed(2)} - bayangkan apa lagi boleh disimpan!`
      });
    }
    
    return insights;
  }, [thisMonthTransactions, categorySpending, budgets, totalSpentThisMonth]);

  // Lifestyle simulator calculations
  const simulatorResults = useMemo(() => {
    const { income, rent, food, transport, entertainment } = lifestyleSimulator;
    const totalExpenses = rent + food + transport + entertainment;
    const surplus = income - totalExpenses;
    const yearlyTravelFund = surplus * 12;
    
    return {
      totalExpenses,
      surplus,
      yearlyTravelFund,
      canAffordKorea: yearlyTravelFund >= 2500,
      canAffordJapan: yearlyTravelFund >= 3500
    };
  }, [lifestyleSimulator]);

  // Add this after simulatorResults useMemo
const goalPredictions = useMemo(() => {
  const monthlySavings = simulatorResults.surplus || 0;
  
  return savingsGoals.map(goal => {
    const remaining = goal.target - goal.current;
    if (monthlySavings <= 0 || remaining <= 0) {
      return { ...goal, monthsToComplete: null, canAchieve: false };
    }
    
    const monthsToComplete = Math.ceil(remaining / monthlySavings);
    const predictedDate = new Date();
    predictedDate.setMonth(predictedDate.getMonth() + monthsToComplete);
    
    const deadlineDate = new Date(goal.deadline);
    const canAchieve = predictedDate <= deadlineDate;
    
    return { 
      ...goal, 
      monthsToComplete, 
      predictedDate: predictedDate.toISOString().split('T')[0],
      canAchieve 
    };
  });
}, [savingsGoals, simulatorResults.surplus]);

  const handleAddTransaction = () => {
    if (!newTransaction.amount) return;
    
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      date: new Date(newTransaction.date).toISOString()
    };
    
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      category: 'Food',
      amount: '',
      paymentMethod: 'Cash',
      needWant: 'Need',
      notes: ''
    });
    setShowAddTransaction(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setTransactions([]);
      setBudgets({
        Food: 500,
        Transport: 200,
        Entertainment: 150,
        Shopping: 200,
        Bills: 300,
        Others: 150
      });
      setSavingsGoals([
        { id: 1, name: 'Emergency Fund', target: 5000, current: 1200, deadline: '2025-12-31' },
        { id: 2, name: 'Japan Trip', target: 3000, current: 800, deadline: '2025-09-30' }
      ]);
    }
  };

  const handleExport = () => {
    const data = {
      transactions,
      budgets,
      savingsGoals,
      exportDate: new Date().toISOString()
    };
    
    const handleAddGoal = () => {
      if (!newGoal.name || !newGoal.target) return;
      
      const goal = {
        id: Date.now(),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: parseFloat(newGoal.current) || 0,
        deadline: newGoal.deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 1 year from now
      };
      
      setSavingsGoals([...savingsGoals, goal]);
      setNewGoal({ name: '', target: '', current: '', deadline: '' });
      setShowAddGoal(false);
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duitcerdik-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertCurrency = (amount) => {
    if (currency === 'MYR') return amount;
    return (amount * exchangeRates[currency]).toFixed(2);
  };

  const getCurrencySymbol = () => {
    const symbols = { MYR: 'RM', USD: '$', SGD: 'S$' };
    return symbols[currency] || 'RM';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
                <p className="text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="MYR">MYR</option>
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
              </select>
              
              <button
                onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')}
                className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? 'BM' : 'EN'}
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.reset}
              </button>
              
              <button
                onClick={handleExport}
                className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.export}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'dashboard', label: t.dashboard, icon: TrendingUp },
            { id: 'expenses', label: t.expenses, icon: PlusCircle },
            { id: 'budget', label: t.budget, icon: Target },
            { id: 'goals', label: t.goals, icon: Target },
            { id: 'simulator', label: t.simulator, icon: Calculator },
            { id: 'insights', label: t.insights, icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{t.totalSpent}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {getCurrencySymbol()}{convertCurrency(totalSpentThisMonth)}
                    </p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{t.budgetUsed}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {budgetUsagePercentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        budgetUsagePercentage > 80 ? 'bg-red-500' : 
                        budgetUsagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{t.savingsGoals}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {savingsGoals.length} Active
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Trend */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.weeklyTrend}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${getCurrencySymbol()}${convertCurrency(value)}`, 'Amount']} />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.categoryBreakdown}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Tooltip formatter={(value) => [`${getCurrencySymbol()}${convertCurrency(value)}`, 'Amount']} />
                    <RechartsPieChart>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Add Transaction */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{t.addExpense}</h3>
                <button
                  onClick={() => setShowAddTransaction(!showAddTransaction)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.addExpense}</span>
                </button>
              </div>
              
              {showAddTransaction && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
                    <select
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.amount}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.paymentMethod}</label>
                    <select
                      value={newTransaction.paymentMethod}
                      onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.needWant}</label>
                    <select
                      value={newTransaction.needWant}
                      onChange={(e) => setNewTransaction({...newTransaction, needWant: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Need">{t.need}</option>
                      <option value="Want">{t.want}</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.notes}</label>
                    <input
                      type="text"
                      value={newTransaction.notes}
                      onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Optional notes..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddTransaction}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {t.save}
                    </button>
                    <button
                      onClick={() => setShowAddTransaction(false)}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle Simulator Tab */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.lifestyleSimTitle}</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Adjust Your Budget</h3>
                  
                  {Object.entries(lifestyleSimulator).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setLifestyleSimulator({
                          ...lifestyleSimulator,
                          [key]: parseFloat(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Results</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Expenses:</span>
                      <span className="font-semibold">{getCurrencySymbol()}{convertCurrency(simulatorResults.totalExpenses)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.surplus}:</span>
                      <span className={`font-semibold ${simulatorResults.surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getCurrencySymbol()}{convertCurrency(simulatorResults.surplus)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yearly Travel Fund:</span>
                      <span className="font-semibold text-purple-600">
                        {getCurrencySymbol()}{convertCurrency(simulatorResults.yearlyTravelFund)}
                      </span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">What you could afford:</p>
                      <div className="space-y-1">
                        <div className={`flex items-center ${simulatorResults.canAffordKorea ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="mr-2">{simulatorResults.canAffordKorea ? '✅' : '❌'}</span>
                          <span>Trip to Korea (RM2,500)</span>
                        </div>
                        <div className={`flex items-center ${simulatorResults.canAffordJapan ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="mr-2">{simulatorResults.canAffordJapan ? '✅' : '❌'}</span>
                          <span>Trip to Japan (RM3,500)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.behavioralInsights}</h2>
              
              {insights.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Add more transactions to get personalized insights!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        insight.type === 'warning' ? 'bg-red-50 border-red-500' :
                        insight.type === 'info' ? 'bg-blue-50 border-blue-500' :
                        'bg-green-50 border-green-500'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                          {insight.type === 'info' && <TrendingUp className="w-5 h-5 text-blue-500" />}
                          {insight.type === 'tip' && <Brain className="w-5 h-5 text-green-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {language === 'en' ? insight.message : insight.messageBM}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <PlusCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No transactions yet. Add your first expense!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Payment</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.slice(-10).reverse().map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.category}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {getCurrencySymbol()}{convertCurrency(transaction.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.paymentMethod}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.needWant === 'Need' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.needWant}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{transaction.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map(category => {
                  const spent = categorySpending[category] || 0;
                  const budget = budgets[category];
                  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                  
                  return (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">{category}</h3>
                        <span className="text-sm text-gray-600">
                          {getCurrencySymbol()}{convertCurrency(spent)} / {getCurrencySymbol()}{convertCurrency(budget)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              percentage > 100 ? 'bg-red-500' :
                              percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}% used</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">Budget:</label>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudgets({
                            ...budgets,
                            [category]: parseFloat(e.target.value) || 0
                          })}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
{activeTab === 'goals' && (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Savings Goals</h2>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., New Car, Wedding"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="5000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
              <input
                type="number"
                value={newGoal.current}
                onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Goal
            </button>
            <button
              onClick={() => setShowAddGoal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
              
              <div className="space-y-4">
                {goalPredictions.map(goal => {
                  const progress = (goal.current / goal.target) * 100;
                  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={goal.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                          <p className="text-sm text-gray-600">
                            {getCurrencySymbol()}{convertCurrency(goal.current)} / {getCurrencySymbol()}{convertCurrency(goal.target)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-purple-600">{progress.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">{daysLeft} days left</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Remaining: {getCurrencySymbol()}{convertCurrency(goal.target - goal.current)}</span>
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      
                      {/* Prediction Section */}
                      {goal.monthsToComplete && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">Prediction:</p>
                          <div className="space-y-1 text-xs">
                            <p className={`${goal.canAchieve ? 'text-green-600' : 'text-red-600'}`}>
                              {goal.canAchieve ? '✅' : '⚠️'} 
                              {goal.canAchieve 
                                ? ` You'll reach this goal in ${goal.monthsToComplete} months (${new Date(goal.predictedDate).toLocaleDateString()})`
                                : ` At current savings rate, you'll need ${goal.monthsToComplete} months but deadline is sooner`
                              }
                            </p>
                            <p className="text-gray-600">
                              Based on monthly surplus: {getCurrencySymbol()}{convertCurrency(simulatorResults.surplus)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuitCerdik;