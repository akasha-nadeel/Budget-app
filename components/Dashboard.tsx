import React, { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { IconWallet, IconTrend, IconAI } from './ui/Icons';
import { generateSpendingInsights } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const Dashboard: React.FC = () => {
  const { transactions, accounts, categories } = useBudget();
  const { isDark } = useTheme();
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Total Spending
  const totalSpent = useMemo(() =>
    transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.amount, 0),
    [transactions]);

  // Total Balance
  const totalBalance = useMemo(() =>
    accounts.reduce((acc, curr) => acc + curr.balance, 0),
    [accounts]);

  // Essential vs Non-Essential Data
  const essentialVsNonData = useMemo(() => {
    let essential = 0;
    let nonEssential = 0;

    transactions.forEach(t => {
      if (t.type !== 'EXPENSE') return;
      const cat = categories.find(c => c.id === t.categoryId);
      if (cat?.type === 'ESSENTIAL') essential += t.amount;
      else nonEssential += t.amount;
    });

    return [
      { name: 'Essential', value: essential },
      { name: 'Non-Essential', value: nonEssential },
    ];
  }, [transactions, categories]);

  // Spending by Account
  const accountSpendingData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type !== 'EXPENSE') return;
      const accName = accounts.find(a => a.id === t.accountId)?.name || 'Unknown';
      data[accName] = (data[accName] || 0) + t.amount;
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  }, [transactions, accounts]);

  const handleGetInsights = async () => {
    setLoadingAi(true);
    const insights = await generateSpendingInsights(transactions, categories, accounts);
    setAiInsights(insights);
    setLoadingAi(false);
  };

  // Chart Colors based on theme
  const pieColors = isDark
    ? ['#facc15', '#52525b'] // Yellow-400 and Zinc-600
    : ['#10b981', '#f43f5e'];

  const barColor = isDark ? '#facc15' : '#6366f1';

  return (
    <div className="pb-24 animate-fade-in relative">
      {/* Hero Section */}
      <div className="relative h-72 w-full bg-slate-900 dark:bg-yellow-400 overflow-hidden rounded-b-[3rem] shadow-2xl transition-colors duration-300">
        {/* Light Mode Image - Blue Budget Icon */}
        <img
          src="/hero-light.svg"
          alt="Budget planning"
          className={`w-full h-full object-cover opacity-20 mix-blend-overlay transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-20'}`}
        />
        {/* Dark Mode Image - Yellow Budget Icon */}
        <img
          src="/hero-dark.svg"
          alt="Budget planning dark"
          className={`absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-black via-slate-900/40 dark:via-black/40 to-transparent"></div>

        <div className="absolute top-0 left-0 w-full h-full p-8 flex flex-col justify-between text-white z-10">
          <div className="flex justify-between items-start pt-4">
            <div>
              <p className="text-slate-300 dark:text-yellow-900 font-medium text-sm mb-1 uppercase tracking-widest opacity-90">Total Balance</p>
              <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-sm dark:text-yellow-50">Rs. {totalBalance.toLocaleString()}</h1>
            </div>
          </div>

          <div className="pb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 dark:text-yellow-400 text-sm font-medium">
              <div className="bg-emerald-500/20 dark:bg-yellow-400/20 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20 dark:border-yellow-400/20">
                <IconTrend className="w-4 h-4" />
                <span>On Track</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 dark:text-yellow-800 text-xs uppercase tracking-wider font-semibold">Total Spent</p>
              <p className="text-xl font-bold text-white">Rs. {totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container (Overlapping Hero) */}
      <div className="-mt-12 px-4 space-y-6 relative z-20">

        {/* AI Insights Button */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-zinc-800 transition-colors duration-300">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-lg">
              <IconAI className="text-purple-500 dark:text-yellow-400 w-6 h-6" /> Smart Insights
            </h3>
            {!aiInsights && (
              <button
                onClick={handleGetInsights}
                disabled={loadingAi}
                className="text-xs bg-purple-100 dark:bg-yellow-400/20 text-purple-700 dark:text-yellow-400 px-4 py-2 rounded-full font-bold hover:bg-purple-200 dark:hover:bg-yellow-400/30 transition-colors disabled:opacity-50"
              >
                {loadingAi ? 'Analyzing...' : 'Generate Analysis'}
              </button>
            )}
          </div>
          {aiInsights && (
            <div className="text-sm text-slate-600 dark:text-zinc-300 bg-purple-50 dark:bg-zinc-950 p-4 rounded-xl mt-3 leading-relaxed border border-purple-100 dark:border-zinc-800">
              <ReactMarkdown className="prose prose-sm prose-purple dark:prose-invert max-w-none">
                {aiInsights}
              </ReactMarkdown>
              <button onClick={() => setAiInsights(null)} className="mt-3 text-xs text-purple-600 dark:text-yellow-400 font-bold hover:underline">Clear Insights</button>
            </div>
          )}
          {!aiInsights && !loadingAi && (
            <p className="text-slate-400 dark:text-zinc-500 text-sm mt-1">Get AI-powered spending analysis and tips based on your recent transactions.</p>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Essential vs Non-Essential */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors duration-300">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Spending Breakdown</h3>
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={essentialVsNonData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {essentialVsNonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: isDark ? '#18181b' : '#fff',
                      color: isDark ? '#fff' : '#1e293b'
                    }}
                    itemStyle={{ color: isDark ? '#fff' : '#1e293b', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text for Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium uppercase">Total</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">Rs. {totalSpent.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: pieColors[0] }}></div>
                Essential
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: pieColors[1] }}></div>
                Extra
              </div>
            </div>
          </div>

          {/* By Source */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors duration-300">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">By Source</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accountSpendingData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    style={{ fontSize: '12px', fontWeight: '500', fill: isDark ? '#a1a1aa' : '#64748b' }}
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? '#27272a' : '#f1f5f9', radius: 4 }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: isDark ? '#18181b' : '#fff'
                    }}
                    itemStyle={{ color: isDark ? '#fff' : '#1e293b' }}
                  />
                  <Bar
                    dataKey="value"
                    fill={barColor}
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                    background={{ fill: isDark ? '#27272a' : '#f8fafc', radius: [0, 6, 6, 0] }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;