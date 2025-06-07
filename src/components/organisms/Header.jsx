import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ activeView, onViewChange, darkMode, onDarkModeToggle }) => {
    const viewOptions = [
        { key: 'flow', icon: 'Waves', label: 'Flow' },
        { key: 'list', icon: 'List', label: 'List' },
        { key: 'rhythm', icon: 'Clock', label: 'Rhythm' }
    ];

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 glass border-b border-white/20 backdrop-blur-xl"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="p-2 bg-gradient-flow rounded-xl"
                        >
                            <ApperIcon name="Waves" className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-heading font-bold text-gradient">
                            FlowState
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* View Toggle */}
                        <div className="flex bg-white rounded-2xl p-1 shadow-flow">
                            {viewOptions.map((view) => (
                                <Button
                                    key={view.key}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onViewChange(view.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                        activeView === view.key
                                            ? 'bg-gradient-flow text-white shadow-flow'
                                            : 'text-gray-600 hover:text-primary'
                                    }`}
                                >
                                    <ApperIcon name={view.icon} size={16} />
                                    <span className="hidden sm:inline">{view.label}</span>
                                </Button>
                            ))}
                        </div>
                        
                        {/* Dark Mode Toggle */}
                        <Button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onDarkModeToggle}
                            className="p-2 rounded-xl bg-white shadow-flow hover:shadow-glow text-gray-600 hover:text-primary"
                        >
                            <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={18} />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;