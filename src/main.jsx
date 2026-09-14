import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Enregistrement doux du Service Worker en arrière-plan sans rechargement forcé de l'application
try {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Pas de rechargement brusque pendant l'usage utilisateur
    },
    onOfflineReady() {
      console.log("GeoProspect est prêt pour le fonctionnement hors-ligne.");
    }
  });
} catch (e) {
  console.warn("PWA Service Worker registration skipped:", e);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

