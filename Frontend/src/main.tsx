import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux';
import store from '@/store/store.ts';


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId="60977816398-pqigncgfv351nbpbsksk4nftn0o8v0l5.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </Provider>
)
