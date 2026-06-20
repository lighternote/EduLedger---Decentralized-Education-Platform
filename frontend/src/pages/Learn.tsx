import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export const Learn: React.FC = () => {
  const courses = [
    { id: 1, title: 'Blockchain Fundamentals', duration: '8 weeks', reward: '100 EDU', level: 'Beginner' },
    { id: 2, title: 'Smart Contract Development', duration: '10 weeks', reward: '150 EDU', level: 'Intermediate' },
    { id: 3, title: 'DeFi Principles', duration: '6 weeks', reward: '120 EDU', level: 'Intermediate' },
    { id: 4, title: 'Web3 Architecture', duration: '12 weeks', reward: '200 EDU', level: 'Advanced' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learn & Earn</h1>
        <p className="mt-2 text-gray-600">Explore courses and earn EDU tokens as you learn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                {course.level}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1" />{course.duration}</span>
              <span className="flex items-center"><CurrencyDollarIcon className="h-4 w-4 mr-1" />{course.reward}</span>
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
              <BookOpenIcon className="h-5 w-5" />
              <span>Start Learning</span>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
