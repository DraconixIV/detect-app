import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Cache buster propre sans interruption de rendu React
const CACHE_VERSION = "v32_fix_black_screen_and_onboarding";
try {
  if (localStorage.getItem("RDL_CACHE_VERSION") !== CACHE_VERSION) {
    localStorage.setItem("RDL_CACHE_VERSION", CACHE_VERSION);
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
  }
} catch (e) {
  console.warn("Cache reset check failed:", e);
}

// S'assure que le nouveau Service Worker s'active immédiatement
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

