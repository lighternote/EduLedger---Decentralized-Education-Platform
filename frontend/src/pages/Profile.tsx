import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, AcademicCapIcon, CurrencyDollarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export const Profile: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your EduLedger profile and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Learner</h2>
            <p className="text-gray-600">Web3 Developer</p>
            <p className="text-sm text-gray-500 mt-2">Member since Jan 2024</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <AcademicCapIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-600">12</p>
                <p className="text-sm text-gray-600">Courses</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">1,250</p>
                <p className="text-sm text-gray-600">EDU Earned</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Cog6ToothIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">15</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">Edit Profile</span>
                <p className="text-sm text-gray-600">Update your personal information</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">Wallet Settings</span>
                <p className="text-sm text-gray-600">Manage your connected wallet</p>
              </button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">Notification Preferences</span>
                <p className="text-sm text-gray-600">Configure email and push notifications</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
