import React from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  CurrencyDollarIcon,
  TrendingUpIcon,
  UsersIcon,
  AwardIcon 
} from '@heroicons/react/outline';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Completed Courses',
      value: '12',
      change: '+2 this month',
      changeType: 'increase',
      icon: BookOpenIcon,
    },
    {
      name: 'EDU Tokens Staked',
      value: '5,000',
      change: '+500 this week',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Credentials Earned',
      value: '8',
      change: '+1 this month',
      changeType: 'increase',
      icon: AwardIcon,
    },
    {
      name: 'Learning Streak',
      value: '15 days',
      change: 'Personal best!',
      changeType: 'increase',
      icon: TrendingUpIcon,
    },
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'Blockchain Fundamentals',
      progress: 85,
      status: 'In Progress',
      reward: '100 EDU',
    },
    {
      id: 2,
      title: 'Smart Contract Development',
      progress: 60,
      status: 'In Progress',
      reward: '150 EDU',
    },
    {
      id: 3,
      title: 'DeFi Principles',
      progress: 100,
      status: 'Completed',
      reward: '120 EDU',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Learner!</h1>
        <p className="mt-2 text-gray-600">Continue your Web3 education journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <stat.icon className="h-8 w-8 text-indigo-600" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Courses</h2>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="border-l-4 border-indigo-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.status}</p>
                    <p className="text-sm text-indigo-600 font-medium">Reward: {course.reward}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-600">{course.progress}%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <BookOpenIcon className="h-5 w-5" />
              <span>Browse Courses</span>
            </button>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5" />
              <span>Stake EDU Tokens</span>
            </button>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <AwardIcon className="h-5 w-5" />
              <span>View Credentials</span>
            </button>
            <button className="w-full border-2 border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2">
              <UsersIcon className="h-5 w-5" />
              <span>Join Study Group</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Learning Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">156</div>
            <div className="text-sm text-gray-600">Hours Learned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600">Skills Acquired</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Certificates Earned</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
