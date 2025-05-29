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
    getAccessTokenSilently
  } = useAuth0();

  // The login function will now trigger Auth0's redirect flow
  const login = async (options) => {
    await loginWithRedirect(options);
  };

  // The logout function will use Auth0's logout
  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Adapt the user object if necessary, or use auth0User directly.
  // For isAdmin, Auth0 roles are often namespaced.
  // Example: user['https://your-app-namespace/roles'] might be an array like ['admin'].
  // For simplicity, we'll assume the role is directly on the user object or a specific claim.
  // You might need to adjust this based on your Auth0 configuration (Rules or Actions).
  const user = isAuthenticated ? auth0User : null;

  const isAdmin = () => {
    // This check needs to be robust based on how roles are set in your Auth0 user profile.
    // It could be a custom claim like user.role or user['https://your-namespace/roles'].includes('admin')
    return user && (user.role === 'admin' || (user['https://beysik.com/roles'] && user['https://beysik.com/roles'].includes('admin')));
  };

  // This function can be used to get an access token for your backend APIs
  const getAccessToken = async () => {
    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently();
        return token;
      } catch (e) {
        console.error("Error getting access token", e);
        // Handle or throw error
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading: isLoading, isAuthenticated, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = function() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;