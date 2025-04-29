
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppProviders } from "./hooks/ui/providers/AppProvider";

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>
)
