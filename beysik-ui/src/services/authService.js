// filepath: c:/Users/ChristianLuisShih/Documents/Beysik-UI/Beysik-UI/beysik-ui/src/services/authService.js
// This service is intended for calls to your application's backend that are related to user
// authentication, authorization, or management, especially those requiring an authenticated session.

/**
 * Example function: Fetches additional user profile data from your application's backend.
 * This assumes your backend has an endpoint like /api/user/profile that is protected
 * and requires an Auth0 access token for the currently authenticated user.
 *
 * @param {Function} getAccessToken - Function to retrieve the Auth0 access token.
 * @returns {Promise<Object|null>} - A promise that resolves to the user profile object from your backend, or null.
 */
export const getBackendUserProfile = async (getAccessToken) => {
  if (typeof getAccessToken !== 'function') {
    console.error('getAccessToken function is required to fetch backend user profile.');
    return Promise.reject(new Error('Authentication token provider is missing or not a function.'));
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      console.warn("No access token available. Cannot fetch backend user profile.");
      return null; // Or throw new Error("Not authenticated or token is unavailable.");
    }

    // Replace '/api/me' with your actual backend endpoint for fetching user-specific data
    const apiUrl = '/api/me'; // EXAMPLE: Replace with your actual endpoint
    /*
    console.log(`Calling API: GET ${apiUrl} with token.`);
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch user profile from backend. Status: ${response.status}`, errorText);
      throw new Error(`Failed to fetch user profile from backend. Status: ${response.status}`);
    }
    const userProfile = await response.json();
    console.log('Backend user profile fetched:', userProfile);
    return userProfile;
    */

    // --- MOCK IMPLEMENTATION (Remove when actual API is integrated) ---
    console.warn(`Using MOCK implementation for getBackendUserProfile. API call to ${apiUrl} is commented out.`);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate fetching some backend-specific user data
        const mockProfile = {
          appSpecificRole: 'editor',
          preferences: {
            theme: 'dark'
          },
          // You might include the Auth0 user ID (sub) if your backend links to it
        };
        console.log('Mock backend user profile returned:', mockProfile);
        resolve(mockProfile);
      }, 700);
    });
    // --- END MOCK IMPLEMENTATION ---

  } catch (error) {
    console.error("Error in getBackendUserProfile:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

/**
 * Example function: Updates user preferences on your backend.
 *
 * @param {Object} preferences - The preferences object to save.
 * @param {Function} getAccessToken - Function to retrieve the Auth0 access token.
 * @returns {Promise<Object|null>} - A promise that resolves to the updated preferences or API response.
 */
export const updateBackendUserPreferences = async (preferences, getAccessToken) => {
  if (typeof getAccessToken !== 'function') {
    console.error('getAccessToken function is required to update backend user preferences.');
    return Promise.reject(new Error('Authentication token provider is missing or not a function.'));
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      console.warn("No access token available. Cannot update backend user preferences.");
      return null;
    }

    const apiUrl = '/api/me/preferences'; // EXAMPLE: Replace with your actual endpoint
    /*
    console.log(`Calling API: POST ${apiUrl} with token.`);
    const response = await fetch(apiUrl, {
      method: 'POST', // or PUT
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update user preferences on backend. Status: ${response.status}`, errorText);
      throw new Error(`Failed to update user preferences on backend. Status: ${response.status}`);
    }
    const updatedData = await response.json();
    console.log('Backend user preferences updated:', updatedData);
    return updatedData;
    */

    // --- MOCK IMPLEMENTATION ---
    console.warn(`Using MOCK implementation for updateBackendUserPreferences. API call to ${apiUrl} is commented out.`);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock: Backend user preferences updated with:', preferences);
        resolve({ success: true, preferences });
      }, 600);
    });
    // --- END MOCK IMPLEMENTATION ---

  } catch (error) {
    console.error("Error in updateBackendUserPreferences:", error);
    throw error;
  }
};

// Note: For direct Auth0 Management API calls (e.g., creating users from an admin panel),
// those should typically be done from a secure backend proxy due to the required permissions
// and to protect your Management API token. Your frontend would call your backend proxy,
// and the backend proxy would then call the Auth0 Management API.

console.log("authService.js loaded. Contains functions for interacting with your application's backend regarding user data.");
