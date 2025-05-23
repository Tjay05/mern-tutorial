import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Context Providers
import { WorkoutsContextProvider } from './context/WorkoutContext';
import { AuthContextProvider } from './context/AuthContext';
import { ModalContextProvider } from './context/ModalContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <ModalContextProvider>
          <App />
        </ModalContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
