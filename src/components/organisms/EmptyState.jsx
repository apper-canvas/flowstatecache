import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ onCreateTaskClick }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-8"
            >
                <ApperIcon name="Waves" className="w-20 h-20 text-primary opacity-60 mx-auto" />
            </motion.div>
            
            <h3 className="text-2xl font-heading font-semibold text-primary mb-4">
                Ready to start your flow?
            </h3>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Capture your first task and begin transforming chaos into smooth productivity flows.
            </p>
            
            <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-flow text-white font-medium rounded-2xl shadow-flow hover:shadow-glow cursor-pointer"
                onClick={onCreateTaskClick}
            >
                <ApperIcon name="Plus" size={18} />
                Create Your First Task
            </Button>
        </motion.div>
    );
};

export default EmptyState;