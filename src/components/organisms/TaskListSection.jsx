import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';

const TaskListSection = ({ title, iconName, tasks, onCompleteTask, onEditTask, onDeleteTask, focusedTask, onTaskFocusToggle }) => {
    if (!tasks || tasks.length === 0) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${iconName === 'Zap' ? 'bg-primary/10' : 'bg-green-100'}`}>
                    <ApperIcon name={iconName} className={`w-5 h-5 ${iconName === 'Zap' ? 'text-primary' : 'text-green-600'}`} />
                </div>
                <h2 className="text-xl font-heading font-semibold text-gray-900">
                    {title} ({tasks.length})
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {tasks.map((task, index) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onComplete={onCompleteTask}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            focusedTask={focusedTask}
                            onToggleFocus={onTaskFocusToggle}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </motion.section>
    );
};

export default TaskListSection;