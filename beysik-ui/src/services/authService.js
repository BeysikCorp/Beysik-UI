// filepath: d:\_School\Beysik\Beysik-UI\beysik-ui\src\services\authService.js
// This service is intended for calls to your application's backend that are related to user
// authentication, authorization, or management, especially those requiring an authenticated session.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Consistent and more detailed error object
class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Consistent response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = response.statusText;
    let errorDetails = null;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
      errorDetails = errorData;
    } catch (e) {
      try {
        errorMessage = await response.text() || response.statusText;
      } catch (textError) {
        // Fallback
      }
    }
    throw new ApiError(errorMessage, response.status, errorDetails);
  }
  // For 204 No Content or other methods that might not return JSON
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null; 
  }
  try {
    return await response.json();
  } catch (e) {
    console.warn("Response was OK but not valid JSON.", e);
    return { message: 'Operation successful, but no JSON content returned.' };
  }
};

/**
 * Example function: Fetches additional user profile data from your application's backend.
 * This assumes your backend has an endpoint like /api/user/profile that is protected
 * and requires an Auth0 access token for the currently authenticated user.
 *
 * @param {Function} getAccessToken - Function to retrieve the Auth0 access token.
 * @returns {Promise<Object|null>} - A promise that resolves to the user profile object from your backend, or null.
 */
export const getBackendUserProfile = async (getAccessToken) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      // console.warn("No access token available. Cannot fetch backend user profile.");
      // return null; 
      throw new ApiError("No access token available. Cannot fetch backend user profile.", 401);
    }

    const apiUrl = `${API_BASE_URL}/me`;
    
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // if (!response.ok) {
    //   const errorText = await response.text();
    //   console.error(`Failed to fetch user profile from backend. Status: ${response.status}`, errorText);
    //   throw new Error(`Failed to fetch user profile from backend. Status: ${response.status}`);
    // }
    // const userProfile = await response.json();
    return handleResponse(response);

  } catch (error) {
    console.error("Error in getBackendUserProfile:", error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to fetch backend user profile', error.status || 500);
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
  try {
    const token = await getAccessToken();
    if (!token) {
      // console.warn("No access token available. Cannot update backend user preferences.");
      // return null;
      throw new ApiError("No access token available. Cannot update backend user preferences.", 401);
    }

    const apiUrl = `${API_BASE_URL}/me/preferences`;
    
    const response = await fetch(apiUrl, {
      method: 'POST', // or PUT
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });

    // if (!response.ok) {
    //   const errorText = await response.text();
    //   console.error(`Failed to update user preferences on backend. Status: ${response.status}`, errorText);
    //   throw new Error(`Failed to update user preferences on backend. Status: ${response.status}`);
    // }
    // const updatedData = await response.json();
    return handleResponse(response);

  } catch (error) {
    console.error("Error in updateBackendUserPreferences:", error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to update backend user preferences', error.status || 500);
  }
};

// Note: For direct Auth0 Management API calls (e.g., creating users from an admin panel),
// those should typically be done from a secure backend proxy due to the required permissions
// and to protect your Management API token. Your frontend would call your backend proxy,
// and the backend proxy would then call the Auth0 Management API.

console.log("authService.js loaded. Contains functions for interacting with your application's backend regarding user data.");
