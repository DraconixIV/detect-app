import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Cache buster propre sans interruption de rendu React
const CACHE_VERSION = "v41_geoprospect_complete";
try {
  if (localStorage.getItem("GEOPROSPECT_CACHE_VERSION") !== CACHE_VERSION) {
    localStorage.setItem("GEOPROSPECT_CACHE_VERSION", CACHE_VERSION);
    // Supprimer les anciens flags pour forcer l'onboarding au rechargement de la nouvelle version
    localStorage.removeItem("geoprospect_onboarding_completed_v2");
    localStorage.removeItem("geoprospect_onboarding_completed_v3");
    localStorage.removeItem("rdl_onboarding_completed_v2");
    localStorage.removeItem("rdl_onboarding_completed_v3");
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

