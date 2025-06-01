// d:\\_School\\Beysik\\Beysik-UI\\beysik-ui\\src\\services\\userService.js
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

  // If we expect JSON but don't get it (and response.ok is true, which is rare for non-204)
  if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Received non-JSON response from ${endpointName} with status ${response.status}. Returning raw response.`);
      // Depending on requirements, you might want to throw an error here
      // or handle it as a special case. For now, returning null or a generic object.
      return { success: true, status: response.status, message: "Received non-JSON success response." };
  }
  
  return response.json();
};

export const getAllUsers = async (token) => {
  if (!token) {
    console.error("getAllUsers: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response, 'getAllUsers');
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to fetch all users.', error.status || 500, error.message);
  }
};

export const getUserById = async (userId, token) => {
  if (!userId) {
    console.error("getUserById: User ID is missing.");
    throw new ApiError("User ID is required.", 400);
  }
  if (!token) {
    console.error("getUserById: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response, `getUserById (ID: ${userId})`);
  } catch (error) {
    console.error(`Error in getUserById for user ${userId}:`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Failed to fetch user ${userId}.`, error.status || 500, error.message);
  }
};

export const updateUser = async (userId, userData, token) => {
  if (!userId) {
    console.error("updateUser: User ID is missing.");
    throw new ApiError("User ID is required.", 400);
  }
  if (!userData || typeof userData !== 'object' || Object.keys(userData).length === 0) {
    console.error("updateUser: User data is missing or invalid.");
    throw new ApiError("User data is required and must be a non-empty object.", 400);
  }
  if (!token) {
    console.error("updateUser: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response, `updateUser (ID: ${userId})`);
  } catch (error) {
    console.error(`Error in updateUser for user ${userId}:`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Failed to update user ${userId}.`, error.status || 500, error.message);
  }
};

export const updateUserRole = async (userId, role, token) => {
  if (!userId) {
    console.error("updateUserRole: User ID is missing.");
    throw new ApiError("User ID is required.", 400);
  }
  if (!role || typeof role !== 'string') {
    console.error("updateUserRole: Role is missing or invalid.");
    throw new ApiError("Role is required and must be a string.", 400);
  }
  if (!token) {
    console.error("updateUserRole: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    return handleResponse(response, `updateUserRole (ID: ${userId})`);
  } catch (error) {
    console.error(`Error in updateUserRole for user ${userId}:`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Failed to update role for user ${userId}.`, error.status || 500, error.message);
  }
};

export const deleteUser = async (userId, token) => {
  if (!userId) {
    console.error("deleteUser: User ID is missing.");
    throw new ApiError("User ID is required.", 400);
  }
  if (!token) {
    console.error("deleteUser: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // For DELETE, 204 No Content is a common successful response.
    // handleResponse will correctly return null for 204.
    // If an error occurs, handleResponse will throw ApiError.
    return handleResponse(response, `deleteUser (ID: ${userId})`);
  } catch (error) {
    console.error(`Error in deleteUser for user ${userId}:`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Failed to delete user ${userId}.`, error.status || 500, error.message);
  }
};
