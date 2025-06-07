import React from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';

const QuickCaptureBar = ({ newTaskTitle, onNewTaskTitleChange, onCreateTask, isCapturing }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-white/20"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
                <FormField
                    id="quick-capture"
                    value={newTaskTitle}
                    onChange={(e) => onNewTaskTitleChange(e.target.value)}
                    onSubmit={onCreateTask}
                    placeholder="Capture a task... (e.g., 'Review project proposal tomorrow morning')"
                    iconName="Sparkles"
                    isSubmitting={isCapturing}
                    submitButtonVisible={!!newTaskTitle}
                />
            </div>
        </motion.div>
    );
};

export default QuickCaptureBar;