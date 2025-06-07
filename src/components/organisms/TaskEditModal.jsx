import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const TaskEditModal = ({ task, isOpen, onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        energyLevel: 'medium',
        optimalTime: 'morning',
        priority: 1
    });
    const [originalData, setOriginalData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Initialize form data when task changes
    useEffect(() => {
        if (task) {
            const data = {
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending',
                energyLevel: task.energyLevel || 'medium',
                optimalTime: task.optimalTime || 'morning',
                priority: task.priority || 1
            };
            setFormData(data);
            setOriginalData(data);
            setErrors({});
            setHasUnsavedChanges(false);
        }
    }, [task]);

    // Check for unsaved changes
    useEffect(() => {
        if (task) {
            const changed = JSON.stringify(formData) !== JSON.stringify(originalData);
            setHasUnsavedChanges(changed);
        }
    }, [formData, originalData, task]);

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleClose();
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }
        
        if (formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }
        
        if (formData.priority < 1 || formData.priority > 5) {
            newErrors.priority = 'Priority must be between 1 and 5';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear specific field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors before saving');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(task.id, formData);
            toast.success('Task updated successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to save task. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(task.id);
            toast.success('Task deleted successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to delete task. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (hasUnsavedChanges) {
            setShowConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const confirmClose = () => {
        setShowConfirmDialog(false);
        onClose();
    };

    if (!isOpen || !task) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="bg-white rounded-3xl shadow-flow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <ApperIcon name="Edit3" className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-heading font-semibold text-gray-900">
                                Edit Task
                            </h2>
                            {hasUnsavedChanges && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg">
                                    Unsaved changes
                                </span>
                            )}
                        </div>
                        <Button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <ApperIcon name="X" size={20} />
                        </Button>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <Input
                                id="task-title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter task title..."
                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                                    errors.title 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                                } focus:ring-2 focus:outline-none`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <ApperIcon name="AlertCircle" size={14} />
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="task-description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Add a description..."
                                rows={3}
                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none ${
                                    errors.description 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                                } focus:ring-2 focus:outline-none`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <ApperIcon name="AlertCircle" size={14} />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Status, Energy, Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Status */}
                            <div>
                                <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    id="task-status"
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {/* Energy Level */}
                            <div>
                                <label htmlFor="task-energy" className="block text-sm font-medium text-gray-700 mb-2">
                                    Energy Level
                                </label>
                                <select
                                    id="task-energy"
                                    value={formData.energyLevel}
                                    onChange={(e) => handleInputChange('energyLevel', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                >
                                    <option value="low">Low Energy</option>
                                    <option value="medium">Medium Energy</option>
                                    <option value="high">High Energy</option>
                                </select>
                            </div>

                            {/* Optimal Time */}
                            <div>
                                <label htmlFor="task-time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Optimal Time
                                </label>
                                <select
                                    id="task-time"
                                    value={formData.optimalTime}
                                    onChange={(e) => handleInputChange('optimalTime', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                >
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="evening">Evening</option>
                                    <option value="anytime">Anytime</option>
                                </select>
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-2">
                                Priority (1-5)
                            </label>
                            <Input
                                id="task-priority"
                                type="number"
                                min="1"
                                max="5"
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                                    errors.priority 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                                } focus:ring-2 focus:outline-none`}
                            />
                            {errors.priority && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <ApperIcon name="AlertCircle" size={14} />
                                    {errors.priority}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Keyboard Shortcuts Info */}
                    <div className="mt-6 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-600 flex items-center gap-2">
                            <ApperIcon name="Keyboard" size={14} />
                            Keyboard shortcuts: Ctrl+S to save, Esc to close
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <Button
                            onClick={() => setShowConfirmDialog(true)}
                            disabled={isDeleting || isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isDeleting ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                    <ApperIcon name="Loader2" size={16} />
                                </motion.div>
                            ) : (
                                <ApperIcon name="Trash2" size={16} />
                            )}
                            Delete Task
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleClose}
                                disabled={isSaving || isDeleting}
                                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || isDeleting || Object.keys(errors).length > 0}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-flow text-white rounded-xl shadow-flow hover:shadow-glow disabled:opacity-50 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSaving ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                        <ApperIcon name="Loader2" size={16} />
                                    </motion.div>
                                ) : (
                                    <ApperIcon name="Save" size={16} />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* Confirmation Dialog */}
                    <AnimatePresence>
                        {showConfirmDialog && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50"
                                onClick={() => setShowConfirmDialog(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-flow p-6 max-w-md w-full"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="text-center">
                                        <ApperIcon name="AlertTriangle" className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {hasUnsavedChanges ? 'Unsaved Changes' : 'Delete Task'}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {hasUnsavedChanges 
                                                ? 'You have unsaved changes. Are you sure you want to close without saving?'
                                                : 'Are you sure you want to delete this task? This action cannot be undone.'
                                            }
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => setShowConfirmDialog(false)}
                                                className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={hasUnsavedChanges ? confirmClose : handleDelete}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                            >
                                                {hasUnsavedChanges ? 'Close Anyway' : 'Delete Task'}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TaskEditModal;