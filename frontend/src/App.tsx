import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Credentials } from './pages/Credentials';
import { Learn } from './pages/Learn';
import { Staking } from './pages/Staking';
import { Profile } from './pages/Profile';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/credentials" element={<Credentials />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
