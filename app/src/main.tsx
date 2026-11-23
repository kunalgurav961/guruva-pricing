import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import { AppProvider } from './store'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <App />
      </AppProvider>
    </MotionConfig>
  </StrictMode>,
)
