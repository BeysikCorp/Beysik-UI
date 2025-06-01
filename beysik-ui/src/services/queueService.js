// Mock implementation for testing without a backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"; // Corrected for Vite

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

/**
 * Sends an order to the backend API (which might then queue it).
 * @param {Object} order - The order data.
 * @param {string} token - Auth0 access token.
 * @returns {Promise} - Promise that resolves with the API response.
 */
export async function sendOrderToQueue(order, token) {
  console.log('Attempting to send order to queue:', order);

  if (!order || typeof order !== 'object' || Object.keys(order).length === 0) {
    console.error("sendOrderToQueue: Order data is missing or invalid.");
    throw new ApiError("Order data is required and must be a non-empty object.", 400);
  }
  if (!token) {
    console.error("sendOrderToQueue: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }

  try {
    const backendApiUrl = `${API_BASE_URL}/orders`; // This endpoint should handle queueing logic on the backend
    
    console.log(`Calling API: POST ${backendApiUrl} with token.`);
    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    return handleResponse(response, 'sendOrderToQueue');

  } catch (error) {
    console.error('Error in sendOrderToQueue:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to send order to queue.', error.status || 500, error.message);
  }
}

/**
 * Gets order status from the backend API.
 * @param {string} orderId - The order ID to check.
 * @param {string} token - Auth0 access token.
 * @returns {Promise} - Promise that resolves with order status.
 */
export async function getOrderStatus(orderId, token) {
  console.log('Attempting to get order status for:', orderId);

  if (!orderId) {
    console.error("getOrderStatus: Order ID is missing.");
    throw new ApiError("Order ID is required.", 400);
  }
  if (!token) {
    console.error("getOrderStatus: Authentication token is missing.");
    throw new ApiError("Authentication token is required.", 401);
  }

  try {
    const apiUrl = `${API_BASE_URL}/orders/${orderId}/status`; 
    
    console.log(`Calling API: GET ${apiUrl} with token.`);
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response, `getOrderStatus (ID: ${orderId})`);

  } catch (error) {
    console.error(`Error in getOrderStatus for order ${orderId}:`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(`Failed to get order status for ${orderId}.`, error.status || 500, error.message);
  }
}

/**
 * Example function: Get general queue status (if such an endpoint exists)
 * This is a placeholder and might not directly map to a RabbitMQ queue status
 * but rather a backend endpoint that provides some overview.
 * @param {string} token - Auth0 access token (optional, depending on endpoint protection).
 */
export async function getGeneralQueueSystemStatus(token) {
  // Token might be optional if it's a public status endpoint
  // Or required if it provides sensitive/detailed queue information.
  // For this example, let's assume it might require a token for admin-level details.
  if (!token) {
    console.warn("getGeneralQueueSystemStatus: Token not provided. Endpoint might be restricted.");
    // Depending on the API design, you might proceed or throw an error.
    // For now, we'll proceed, and the backend will decide access.
  }
  try {
    const response = await fetch(`${API_BASE_URL}/system/queue-status`, { // Example endpoint
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    return handleResponse(response, 'getGeneralQueueSystemStatus');
  } catch (error) {
    console.error("Could not fetch general queue system status:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to fetch general queue system status.', error.status || 500, error.message);
  }
}

// Note: Direct RabbitMQ interaction is a backend concern.
// Frontend interacts with backend APIs that manage the queue.
// Removed getAccessToken parameter as token is now passed directly.