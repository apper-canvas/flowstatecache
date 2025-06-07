import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ errorMessage, onRetry }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
        >
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                Flow Interrupted
            </h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="px-6 py-3 bg-primary text-white font-medium rounded-2xl shadow-flow hover:shadow-glow"
            >
                Restore Flow
            </Button>
        </motion.div>
    );
};

export default ErrorState;