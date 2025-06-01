// d:\\_School\\Beysik\\Beysik-UI\\beysik-ui\\src\\services\\settingsService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Custom Error class for API errors
class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const handleResponse = async (response, endpointName) => {
  const contentType = response.headers.get("content-type");
  let errorData = { message: response.statusText };

  if (contentType && contentType.includes("application/json")) {
    errorData = await response.json().catch(() => ({ message: `Failed to parse JSON response from ${endpointName}` }));
  }

  if (!response.ok) {
    console.error(`API Error in ${endpointName}: ${response.status}`, errorData);
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status} from ${endpointName}`,
      response.status,
      errorData.details || errorData
    );
  }

  if (response.status === 204) { // No Content
    return null;
  }
  
  if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Received non-JSON response from ${endpointName} with status ${response.status}. Returning raw response.`);
      return { success: true, status: response.status, message: "Received non-JSON success response." };
  }

  return response.json();
};

export const getSettings = async (token) => {
  if (!token) {
    console.error("getSettings: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });
    return handleResponse(response, 'getSettings');
  } catch (error) {
    console.error('Error in getSettings:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to fetch settings.', error.status || 500, error.message);
  }
};

export const updateSettings = async (settingsData, token) => {
  if (!settingsData || typeof settingsData !== 'object' || Object.keys(settingsData).length === 0) {
    console.error("updateSettings: Settings data is missing or invalid.");
    throw new ApiError("Settings data is required and must be a non-empty object.", 400);
  }
  if (!token) {
    console.error("updateSettings: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settingsData),
    });
    return handleResponse(response, 'updateSettings');
  } catch (error) {
    console.error('Error in updateSettings:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to update settings.', error.status || 500, error.message);
  }
};
