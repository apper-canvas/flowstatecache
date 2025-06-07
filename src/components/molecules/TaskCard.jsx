import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const getEnergyColor = (level) => {
    switch (level) {
        case 'high': return 'from-accent to-orange-300';
        case 'medium': return 'from-secondary to-secondary-light';
        case 'low': return 'from-primary-light to-surface-300';
        default: return 'from-gray-200 to-gray-100';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'completed': return 'CheckCircle2';
        case 'in-progress': return 'Clock';
        default: return 'Circle';
    }
};

const TaskCard = ({ task, index, onComplete, onDelete, focusedTask, onToggleFocus }) => {
    const isFocused = focusedTask === task.id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ delay: index * 0.1, type: "spring", damping: 25 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className={`relative p-6 rounded-3xl shadow-flow hover:shadow-glow transition-all duration-300 cursor-pointer paper-texture group ${
                task.status === 'completed'
                    ? 'bg-gradient-to-br from-green-50 to-green-100 opacity-75'
                    : 'bg-white hover:bg-surface-50'
            } ${isFocused ? 'ring-2 ring-primary shadow-glow' : ''}`}
            onClick={() => onToggleFocus(task.id)}
        >
            <div className="flex items-start gap-4">
                <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onComplete(task.id);
                    }}
                    className={`flex-shrink-0 p-2 rounded-xl transition-all duration-300 ${
                        task.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 hover:bg-primary hover:text-white'
                    }`}
                >
                    <ApperIcon name={getStatusIcon(task.status)} size={18} />
                </Button>
                
                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-gray-900 mb-2 ${
                        task.status === 'completed' ? 'line-through opacity-60' : ''
                    }`}>
                        {task.title}
                    </h3>
                    
                    {task.description && (
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${getEnergyColor(task.energyLevel)} text-gray-700`}>
                            {task.energyLevel} energy
                        </span>
                        
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-surface-100 text-gray-600">
                            {task.optimalTime}
                        </span>
                        
                        {task.priority > 1 && (
                            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-accent text-gray-700">
                                Priority {task.priority}
                            </span>
                        )}
                    </div>
                </div>
                
                <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all duration-300"
                >
                    <ApperIcon name="X" size={16} />
                </Button>
            </div>
            
            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-surface-200"
                >
                    <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
                        {task.completedAt && (
                            <p><strong>Completed:</strong> {new Date(task.completedAt).toLocaleDateString()}</p>
                        )}
                    </div>
                </motion.div>
            )}
            
            {task.status === 'completed' && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                    <ApperIcon name="Check" size={12} className="text-white" />
                </motion.div>
            )}
        </motion.div>
    );
};

export default TaskCard;