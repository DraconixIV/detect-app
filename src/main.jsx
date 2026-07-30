import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// FORCE CACHE BUSTER DEFINITIF POUR VIDER LE CACHE DU NAVIGATEUR
const CACHE_VERSION = "v14_dual_storage_fallback";
if (localStorage.getItem("RDL_CACHE_VERSION") !== CACHE_VERSION) {
  localStorage.setItem("RDL_CACHE_VERSION", CACHE_VERSION);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  if ('caches' in window) {
    caches.keys().then((names) => {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
  setTimeout(() => {
    window.location.reload();
  }, 200);
}

// S'assure que le nouveau Service Worker s'active immédiatement
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
