import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="Compass" className="w-24 h-24 text-primary mx-auto opacity-60" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-primary mb-4">
          Lost in the Flow
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          This path doesn't exist in your productivity journey. Let's guide you back to your flow.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-gradient-flow text-white font-medium rounded-2xl shadow-flow hover:shadow-glow transition-all duration-300"
        >
          Return to Flow Board
        </motion.button>
      </motion.div>
    </div>
  )
}

export default NotFound