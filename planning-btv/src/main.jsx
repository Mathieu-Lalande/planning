import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PlanningProvider } from './contexts/PlanningContext'
import { ConfirmProvider } from './contexts/ConfirmContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PlanningProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </PlanningProvider>
  </React.StrictMode>,
)
