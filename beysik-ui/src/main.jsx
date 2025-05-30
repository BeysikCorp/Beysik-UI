import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './context/AuthContext'; // Your custom AuthContext
import { CartProvider } from './context/CartContext'; // Import CartProvider
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Your MUI theme
import './styles/global.css'; // Your global styles

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

if (!domain || !clientId) {
  console.error(
    "Auth0 domain or client ID is missing. Please check your .env file."
  );
  // You could render an error message to the user here
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          ...(audience && { audience: audience }), // Conditionally add audience
        }}
        cacheLocation="localstorage" // Recommended for SPAs
      >
        <AuthProvider> {/* Your custom AuthProvider that uses useAuth0 */}
          <CartProvider> {/* Wrap App with CartProvider */}
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
