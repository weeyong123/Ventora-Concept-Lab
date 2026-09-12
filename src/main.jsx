import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Coach from './Coach.jsx'
import Construction from './Construction.jsx'
import Saas from './Saas.jsx'
import LeadstouConcept from './LeadstouConcept.jsx'

const route = window.location.pathname.replace(/\/+$/, '') || '/'
const isCoach = route === '/coach'
const isConstruction = route === '/construction'
const isSaas = route === '/saas'
const isLeadstou = route === '/leadstou-concept'
document.documentElement.dataset.demo = isLeadstou ? 'leadstou' : isSaas ? 'saas' : isConstruction ? 'construction' : isCoach ? 'coach' : 'noema'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isLeadstou ? <LeadstouConcept /> : isSaas ? <Saas /> : isConstruction ? <Construction /> : isCoach ? <Coach /> : <App />}
  </StrictMode>,
)
