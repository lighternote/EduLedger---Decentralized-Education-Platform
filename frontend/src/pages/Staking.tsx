import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, LockClosedIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export const Staking: React.FC = () => {
  const [stakeAmount, setStakeAmount] = useState('');

  const stakingPools = [
    { name: 'Flexible', apy: '5%', lockPeriod: 'None', minStake: '100 EDU' },
    { name: '30-Day Lock', apy: '12%', lockPeriod: '30 days', minStake: '500 EDU' },
    { name: '90-Day Lock', apy: '20%', lockPeriod: '90 days', minStake: '1000 EDU' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staking</h1>
        <p className="mt-2 text-gray-600">Stake your EDU tokens to earn rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <CurrencyDollarIcon className="h-10 w-10 text-indigo-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Your Balance</h3>
          <p className="text-2xl font-bold text-indigo-600">5,000 EDU</p>
          <p className="text-sm text-gray-500">Available to stake</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <LockClosedIcon className="h-10 w-10 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Currently Staked</h3>
          <p className="text-2xl font-bold text-green-600">2,500 EDU</p>
          <p className="text-sm text-gray-500">In 30-Day Pool</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <ChartBarIcon className="h-10 w-10 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Rewards Earned</h3>
          <p className="text-2xl font-bold text-purple-600">125 EDU</p>
          <p className="text-sm text-gray-500">Total rewards</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Stake Tokens</h2>
        <div className="flex space-x-4">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount to stake"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Stake
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Staking Pools</h2>
        <div className="space-y-4">
          {stakingPools.map((pool, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                <p className="text-sm text-gray-600">Lock: {pool.lockPeriod} • Min: {pool.minStake}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">{pool.apy}</p>
                <p className="text-xs text-gray-500">APY</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
