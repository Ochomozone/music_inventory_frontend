import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId="916732842120-7vic8plva9e0chbbqnnuibc21m7ldd38.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);
