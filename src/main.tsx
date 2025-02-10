import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Ai from './ai/Ai'
import { BrowserRouter as Router } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Ai />    
    </Router>
    
  </React.StrictMode>,
)
