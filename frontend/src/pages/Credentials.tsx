import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export const Credentials: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Credentials</h1>
        <p className="mt-2 text-gray-600">View and manage your educational credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <ShieldCheckIcon className="h-10 w-10 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Verified</h3>
          <p className="text-2xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-500">credentials verified</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <AcademicCapIcon className="h-10 w-10 text-indigo-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Issued</h3>
          <p className="text-2xl font-bold text-indigo-600">12</p>
          <p className="text-sm text-gray-500">total credentials</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <BookOpenIcon className="h-10 w-10 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <p className="text-2xl font-bold text-purple-600">23</p>
          <p className="text-sm text-gray-500">skills certified</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Credentials</h2>
        <div className="space-y-4">
          {[
            { name: 'Blockchain Fundamentals', issuer: 'EduLedger Academy', date: '2024-01-15', type: 'Certificate' },
            { name: 'Smart Contract Development', issuer: 'EduLedger Academy', date: '2024-02-20', type: 'Certificate' },
            { name: 'DeFi Principles', issuer: 'EduLedger Academy', date: '2024-03-10', type: 'Badge' },
          ].map((cred, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{cred.name}</h3>
                <p className="text-sm text-gray-600">{cred.issuer} • {cred.date}</p>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {cred.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
