import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const ProgressRiver = ({ completedTasksCount = 0, totalTasksCount = 0 }) => {
    // Return null if no tasks to show
    if (completedTasksCount === 0 && totalTasksCount === 0) {
        return null;
    }

    const progressPercentage = Math.min((completedTasksCount / Math.max(totalTasksCount, 1)) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-flow p-4 max-w-xs"
        >
            <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="TrendingUp" className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Progress River</span>
            </div>
            <div className="text-xs text-gray-600">
                {completedTasksCount} tasks completed today
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                ></motion.div>
            </div>
        </motion.div>
    );
};

export default ProgressRiver;