import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AsgardeoProvider } from "@asgardeo/react";

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AsgardeoProvider
      clientId="27SjrIh3SkgmM7Q5unAqorZfwjka"
      baseUrl="https://api.asgardeo.io/t/uvinidev"
      scopes={[
        "openid",
        "profile",
        "roles",
        "internal_login",
      ]}
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
);
