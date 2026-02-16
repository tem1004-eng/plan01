
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { DiaryEntry, User, Mood } from './types';
import { MOCK_USER } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import EntryDetail from './components/EntryDetail';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load initial state
  useEffect(() => {
    const savedEntries = localStorage.getItem('lumina_entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    const savedUser = localStorage.getItem('lumina_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('lumina_entries', JSON.stringify(entries));
  }, [entries]);

  const handleLogin = () => {
    // Simulate Google Login
    setUser(MOCK_USER);
    localStorage.setItem('lumina_user', JSON.stringify(MOCK_USER));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
  };

  const addEntry = (entry: DiaryEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (updated: DiaryEntry) => {
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard entries={entries} />} />
              <Route path="/new" element={<EntryForm onSave={addEntry} />} />
              <Route path="/edit/:id" element={<EntryForm entries={entries} onSave={updateEntry} />} />
              <Route path="/entry/:id" element={<EntryDetail entries={entries} onDelete={deleteEntry} onUpdate={updateEntry} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
