import React, { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const {
    loginWithRedirect,
    logout: auth0Logout,
    user: auth0User,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    error: auth0Error,
  } = useAuth0();

  // Wrapper for logout to include Auth0's options
  const logout = (options) => {
    auth0Logout({ 
      logoutParams: { 
        returnTo: window.location.origin, 
        ...options?.logoutParams 
      },
      ...options 
    });
  };

  // Wrapper for getAccessTokenSilently to simplify its use
  // The backend team will ensure the 'audience' is correctly configured in Auth0Provider
  const getAccessToken = async (options) => {
    try {
      const token = await getAccessTokenSilently(options);
      return token;
    } catch (e) {
      console.error("Error getting access token from AuthContext:", e);
      // Handle specific errors, e.g., if consent is required or login is required
      if (e.error === 'login_required' || e.error === 'consent_required') {
        // Optionally trigger loginWithRedirect here if appropriate for your UX
        // loginWithRedirect(); 
      }
      throw e; // Re-throw so the caller can handle it
    }
  };
  
  // Adapt the user object if necessary, or use auth0User directly.
  // For isAdmin, Auth0 roles are often namespaced.
  const user = isAuthenticated ? auth0User : null;

  const isAdmin = () => {
    if (!user) return false;
    // The backend team should define how roles are namespaced in Auth0.
    // Example: user['https://beysik.com/roles'] might be an array like ['admin'].
    const roles = user['https://beysik.com/roles'] || user['http://beysik.com/roles'] || []; // Adjust namespace
    return roles.includes('admin');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: loginWithRedirect, // Use Auth0's login directly
      logout, 
      isAdmin, 
      loading: isLoading, 
      isAuthenticated, 
      getAccessToken,
      authError: auth0Error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};