import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StreetStudio from './StreetStudio.jsx'
import PropertyAdvisor from './PropertyAdvisor.jsx'
import Coach from './Coach.jsx'
import Construction from './Construction.jsx'
import Saas from './Saas.jsx'
import LeadstouConcept from './LeadstouConcept.jsx'
import HighTicketBabesPage from './pages/HighTicketBabes/HighTicketBabesPage.jsx'

const Demo9 = lazy(() => import('./pages/Demo9/Demo9.jsx'))

const route = window.location.pathname.replace(/\/+$/, '') || '/'
const isStreetStudio = route === '/street-studio'
const isPropertyAdvisor = route === '/property-advisor'
const isCoach = route === '/coach'
const isConstruction = route === '/construction'
const isSaas = route === '/saas'
const isLeadstou = route === '/leadstou-concept'
const isHighTicketBabes = route === '/highticketbabes'
document.documentElement.dataset.demo = isStreetStudio ? 'street-studio' : isPropertyAdvisor ? 'property-advisor' : isLeadstou ? 'leadstou' : isSaas ? 'saas' : isConstruction ? 'construction' : isCoach ? 'coach' : 'noema'
if (route === '/demo9') document.documentElement.dataset.demo = 'demo9'
if (isHighTicketBabes) document.documentElement.dataset.demo = 'highticketbabes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {route === '/demo9' ? <Suspense fallback={null}><Demo9 /></Suspense> : isHighTicketBabes ? <HighTicketBabesPage /> : isStreetStudio ? <StreetStudio /> : isPropertyAdvisor ? <PropertyAdvisor /> : isLeadstou ? <LeadstouConcept /> : isSaas ? <Saas /> : isConstruction ? <Construction /> : isCoach ? <Coach /> : <App />}
  </StrictMode>,
)
