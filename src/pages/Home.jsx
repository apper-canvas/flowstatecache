import React from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <MainFeature />
    </motion.div>
  )
}

export default Home