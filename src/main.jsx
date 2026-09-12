import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Coach from './Coach.jsx'

const isCoach = window.location.pathname.replace(/\/+$/, '') === '/coach'
document.documentElement.dataset.demo = isCoach ? 'coach' : 'noema'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isCoach ? <Coach /> : <App />}
  </StrictMode>,
)
