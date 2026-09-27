import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { registerSW } from 'virtual:pwa-register'

try {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Auto-update to latest assets cleanly
      updateSW(true);
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
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

