import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ index }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-3xl bg-white shadow-flow"
        >
            <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingSkeleton;