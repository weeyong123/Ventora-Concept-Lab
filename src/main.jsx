import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PropertyAdvisor from './PropertyAdvisor.jsx'
import Coach from './Coach.jsx'
import Construction from './Construction.jsx'
import Saas from './Saas.jsx'
import LeadstouConcept from './LeadstouConcept.jsx'

const route = window.location.pathname.replace(/\/+$/, '') || '/'
const isPropertyAdvisor = route === '/property-advisor'
const isCoach = route === '/coach'
const isConstruction = route === '/construction'
const isSaas = route === '/saas'
const isLeadstou = route === '/leadstou-concept'
document.documentElement.dataset.demo = isPropertyAdvisor ? 'property-advisor' : isLeadstou ? 'leadstou' : isSaas ? 'saas' : isConstruction ? 'construction' : isCoach ? 'coach' : 'noema'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPropertyAdvisor ? <PropertyAdvisor /> : isLeadstou ? <LeadstouConcept /> : isSaas ? <Saas /> : isConstruction ? <Construction /> : isCoach ? <Coach /> : <App />}
  </StrictMode>,
)
