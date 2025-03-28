import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CookiesProvider } from 'react-cookie'
import AppProvider from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </CookiesProvider>
  </StrictMode>,
)
