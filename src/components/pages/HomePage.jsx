import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import taskService from '@/services/api/taskService';
import listService from '@/services/api/listService';

import Header from '@/components/organisms/Header';
import QuickCaptureBar from '@/components/organisms/QuickCaptureBar';
import TaskListSection from '@/components/organisms/TaskListSection';
import ProgressRiver from '@/components/organisms/ProgressRiver';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]); // lists state is not used in UI but kept for functionality preservation
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState('flow');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [focusedTask, setFocusedTask] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [tasksData, listsData] = await Promise.all([
                taskService.getAll(),
                listService.getAll()
            ]);
            setTasks(tasksData);
            setLists(listsData);
        } catch (err) {
            setError(err.message || 'Failed to load data');
            toast.error('Failed to load your tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setIsCapturing(true);
        try {
            const newTask = await taskService.create({
                title: newTaskTitle.trim(),
                description: '',
                status: 'pending',
                energyLevel: 'medium',
                optimalTime: 'morning',
                connections: [],
                priority: 1
            });
            
            setTasks(prev => [newTask, ...prev]);
            setNewTaskTitle('');
            toast.success('Task captured in your flow!');
        } catch (err) {
            toast.error('Failed to create task');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const updatedTask = await taskService.update(taskId, {
                status: 'completed',
                completedAt: new Date().toISOString()
            });
            
            setTasks(prev => prev.map(task => 
                task.id === taskId ? updatedTask : task
            ));
            toast.success('Task completed! Great flow!');
        } catch (err) {
            toast.error('Failed to complete task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.delete(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
            toast.success('Task removed from flow');
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    const handleToggleTaskFocus = (taskId) => {
        setFocusedTask(focusedTask === taskId ? null : taskId);
    };

    const pendingTasks = tasks.filter(task => task.status !== 'completed');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-subtle'}`}
        >
            <Header
                activeView={activeView}
                onViewChange={setActiveView}
                darkMode={darkMode}
                onDarkModeToggle={() => setDarkMode(!darkMode)}
            />
            
            <QuickCaptureBar
                newTaskTitle={newTaskTitle}
                onNewTaskTitleChange={setNewTaskTitle}
                onCreateTask={handleCreateTask}
                isCapturing={isCapturing}
            />

            <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <LoadingSkeleton key={i} index={i} />
                        ))}
                    </div>
                ) : error ? (
                    <ErrorState errorMessage={error} onRetry={loadData} />
                ) : tasks.length === 0 ? (
                    <EmptyState onCreateTaskClick={() => document.getElementById('quick-capture')?.focus()} />
                ) : (
                    <div className="space-y-8">
                        <TaskListSection
                            title="Active Flow"
                            iconName="Zap"
                            tasks={pendingTasks}
                            onCompleteTask={handleCompleteTask}
                            onDeleteTask={handleDeleteTask}
                            focusedTask={focusedTask}
                            onTaskFocusToggle={handleToggleTaskFocus}
                        />

                        <TaskListSection
                            title="Completed Flow"
                            iconName="CheckCircle"
                            tasks={completedTasks}
                            onCompleteTask={handleCompleteTask}
                            onDeleteTask={handleDeleteTask}
                            focusedTask={focusedTask}
                            onTaskFocusToggle={handleToggleTaskFocus}
                        />
                    </div>
                )}
            </main>

            <ProgressRiver
                completedTasksCount={completedTasks.length}
                totalTasksCount={tasks.length}
            />
        </motion.div>
    );
};

export default HomePage;