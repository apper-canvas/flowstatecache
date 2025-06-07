import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from '@/components/pages/HomePage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-subtle">
        <Routes>
<Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-4"
          toastClassName="rounded-2xl shadow-flow"
        />
      </div>
    </Router>
  )
}

export default App