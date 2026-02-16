import React, { useState, useEffect } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import { ThemeProvider } from './context/ThemeContext';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import AccountsView from './components/AccountsView';
import CategoriesView from './components/CategoriesView';
import AddTransaction from './components/AddTransaction';
import { IconDashboard, IconCalendar, IconPlus, IconWallet, IconCategory } from './components/ui/Icons';

type Tab = 'DASHBOARD' | 'CALENDAR' | 'CATEGORIES' | 'ACCOUNTS';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Show splash for 2.5 seconds total
    const timer = setTimeout(() => {
      setOpacity(0); // Start fade out
      setTimeout(onFinish, 500); // Unmount after fade out
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-black transition-opacity duration-500 ease-in-out"
      style={{ opacity }}
    >
      <div className="relative flex items-center justify-center w-24 h-24 mb-6 bg-indigo-600 dark:bg-yellow-400 rounded-[2rem] shadow-2xl shadow-indigo-200 dark:shadow-yellow-900/20 animate-fade-in">
         <IconWallet className="w-12 h-12 text-white dark:text-black" />
         <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-pulse"></div>
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight animate-slide-up">
        <span className="text-indigo-600 dark:text-yellow-400">Smart</span>Budget
      </h1>
      <p className="text-sm text-slate-400 dark:text-zinc-500 font-medium tracking-[0.2em] uppercase mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        Financial Freedom
      </p>

      {/* Loading Bar */}
      <div className="w-48 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-indigo-600 dark:bg-yellow-400 w-1/2 animate-shimmer rounded-full"></div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [showAddModal, setShowAddModal] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'DASHBOARD': return <Dashboard />;
      case 'CALENDAR': return <CalendarView />;
      case 'CATEGORIES': return <CategoriesView />;
      case 'ACCOUNTS': return <AccountsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-zinc-950 font-sans transition-colors duration-300 animate-fade-in">
      
      {/* Top Navigation Bar */}
      <NavBar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {renderContent()}
      </main>

      {/* Floating Add Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 bg-slate-900 dark:bg-yellow-400 dark:text-black text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95 z-40"
      >
        <IconPlus className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 pb-safe pt-2 px-2 shadow-lg z-50 h-[80px] transition-colors duration-300">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <NavBtn 
            active={activeTab === 'DASHBOARD'} 
            onClick={() => setActiveTab('DASHBOARD')} 
            icon={<IconDashboard className="w-6 h-6" />} 
            label="Home" 
          />
          <NavBtn 
            active={activeTab === 'CALENDAR'} 
            onClick={() => setActiveTab('CALENDAR')} 
            icon={<IconCalendar className="w-6 h-6" />} 
            label="Calendar" 
          />
          <NavBtn 
            active={activeTab === 'CATEGORIES'} 
            onClick={() => setActiveTab('CATEGORIES')} 
            icon={<IconCategory className="w-6 h-6" />} 
            label="Categories" 
          />
          <NavBtn 
            active={activeTab === 'ACCOUNTS'} 
            onClick={() => setActiveTab('ACCOUNTS')} 
            icon={<IconWallet className="w-6 h-6" />} 
            label="Sources" 
          />
        </div>
      </nav>

      {/* Add Transaction Modal */}
      {showAddModal && <AddTransaction onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors duration-200 ${active ? 'text-indigo-600 dark:text-yellow-400' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const Main: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
        return <SplashScreen onFinish={() => setIsLoading(false)} />;
    }

    return <AppContent />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BudgetProvider>
        <Main />
      </BudgetProvider>
    </ThemeProvider>
  );
};

export default App;