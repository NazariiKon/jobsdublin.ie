import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(<GoogleOAuthProvider clientId="60977816398-pqigncgfv351nbpbsksk4nftn0o8v0l5.apps.googleusercontent.com"><App /></GoogleOAuthProvider>)
