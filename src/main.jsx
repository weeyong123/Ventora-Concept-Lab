import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Coach from './Coach.jsx'
import Construction from './Construction.jsx'
import Saas from './Saas.jsx'

const route = window.location.pathname.replace(/\/+$/, '') || '/'
const isCoach = route === '/coach'
const isConstruction = route === '/construction'
const isSaas = route === '/saas'
document.documentElement.dataset.demo = isSaas ? 'saas' : isConstruction ? 'construction' : isCoach ? 'coach' : 'noema'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isSaas ? <Saas /> : isConstruction ? <Construction /> : isCoach ? <Coach /> : <App />}
  </StrictMode>,
)
