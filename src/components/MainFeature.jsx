import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import taskService from '../services/api/taskService'
import listService from '../services/api/listService'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeView, setActiveView] = useState('flow')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  const [focusedTask, setFocusedTask] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksData, listsData] = await Promise.all([
        taskService.getAll(),
        listService.getAll()
      ])
      setTasks(tasksData)
      setLists(listsData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load your tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setIsCapturing(true)
    try {
      const newTask = await taskService.create({
        title: newTaskTitle.trim(),
        description: '',
        status: 'pending',
        energyLevel: 'medium',
        optimalTime: 'morning',
        connections: [],
        priority: 1
      })
      
      setTasks(prev => [newTask, ...prev])
      setNewTaskTitle('')
      toast.success('Task captured in your flow!')
    } catch (err) {
      toast.error('Failed to create task')
    } finally {
      setIsCapturing(false)
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, {
        status: 'completed',
        completedAt: new Date().toISOString()
      })
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))
      toast.success('Task completed! Great flow!')
    } catch (err) {
      toast.error('Failed to complete task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast.success('Task removed from flow')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const getEnergyColor = (level) => {
    switch (level) {
      case 'high': return 'from-accent to-orange-300'
      case 'medium': return 'from-secondary to-secondary-light'
      case 'low': return 'from-primary-light to-surface-300'
      default: return 'from-gray-200 to-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle2'
      case 'in-progress': return 'Clock'
      default: return 'Circle'
    }
  }

  const TaskCard = ({ task, index }) => (
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
      } ${focusedTask === task.id ? 'ring-2 ring-primary shadow-glow' : ''}`}
      onClick={() => setFocusedTask(focusedTask === task.id ? null : task.id)}
    >
      <div className="flex items-start gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            handleCompleteTask(task.id)
          }}
          className={`flex-shrink-0 p-2 rounded-xl transition-all duration-300 ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 hover:bg-primary hover:text-white'
          }`}
        >
          <ApperIcon name={getStatusIcon(task.status)} size={18} />
        </motion.button>
        
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
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteTask(task.id)
          }}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all duration-300"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      </div>
      
      {focusedTask === task.id && (
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
  )

  const SkeletonCard = ({ index }) => (
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
  )

  const EmptyState = () => (
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
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-flow text-white font-medium rounded-2xl shadow-flow hover:shadow-glow cursor-pointer"
        onClick={() => document.getElementById('quick-capture')?.focus()}
      >
        <ApperIcon name="Plus" size={18} />
        Create Your First Task
      </motion.div>
    </motion.div>
  )

  const ErrorState = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-16"
    >
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
        Flow Interrupted
      </h3>
      <p className="text-gray-600 mb-6">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={loadData}
        className="px-6 py-3 bg-primary text-white font-medium rounded-2xl shadow-flow hover:shadow-glow"
      >
        Restore Flow
      </motion.button>
    </motion.div>
  )

  const pendingTasks = tasks.filter(task => task.status !== 'completed')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-subtle'}`}>
      {/* Header */}
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
                {[
                  { key: 'flow', icon: 'Waves', label: 'Flow' },
                  { key: 'list', icon: 'List', label: 'List' },
                  { key: 'rhythm', icon: 'Clock', label: 'Rhythm' }
                ].map((view) => (
                  <motion.button
                    key={view.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView(view.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeView === view.key
                        ? 'bg-gradient-flow text-white shadow-flow'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <ApperIcon name={view.icon} size={16} />
                    <span className="hidden sm:inline">{view.label}</span>
                  </motion.button>
                ))}
              </div>
              
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-white shadow-flow hover:shadow-glow text-gray-600 hover:text-primary"
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Quick Capture Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-white/20"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <form onSubmit={handleCreateTask} className="relative">
            <div className="relative">
              <input
                id="quick-capture"
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Capture a task... (e.g., 'Review project proposal tomorrow morning')"
                className="w-full px-6 py-4 pl-14 bg-white rounded-2xl shadow-flow focus:shadow-glow focus:ring-2 focus:ring-primary/20 border border-surface-200 focus:border-primary transition-all duration-300 text-gray-900 placeholder-gray-500"
                disabled={isCapturing}
              />
              
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-primary" />
              </div>
              
              <AnimatePresence>
                {newTaskTitle && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={isCapturing}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-flow text-white rounded-xl shadow-flow hover:shadow-glow disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Loader2" size={20} />
                      </motion.div>
                    ) : (
                      <ApperIcon name="Send" size={20} />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState />
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {/* Active Tasks */}
            {pendingTasks.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <ApperIcon name="Zap" className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-gray-900">
                    Active Flow ({pendingTasks.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {pendingTasks.map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-gray-900">
                    Completed Flow ({completedTasks.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {completedTasks.map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </div>
        )}
      </main>

      {/* Progress River Visualization */}
      {completedTasks.length > 0 && (
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
            {completedTasks.length} tasks completed today
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((completedTasks.length / Math.max(tasks.length, 1)) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
            ></motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MainFeature