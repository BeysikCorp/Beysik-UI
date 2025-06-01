// Filepath: d:\_School\Beysik\Beysik-UI\beysik-ui\src\services\orderService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
  if (response.status === 204) {
    return null; 
  }
  try {
    return await response.json();
  } catch (e) {
    console.warn("Response was OK but not valid JSON.", e);
    return { message: 'Operation successful, no JSON content returned.' };
  }
};

export const getAllOrders = async (token) => {
  if (!token) throw new ApiError("Authentication token is required.", 401);
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error in getAllOrders:", error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to fetch all orders', error.status || 500);
  }
};

export const getOrderById = async (orderId, token) => {
  if (!token) throw new ApiError("Authentication token is required.", 401);
  if (!orderId) throw new ApiError("Order ID is required.", 400);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error in getOrderById for ${orderId}:`, error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || `Failed to fetch order ${orderId}`, error.status || 500);
  }
};

export const createOrder = async (orderData, token) => {
  if (!token) throw new ApiError("Authentication token is required.", 401);
  // Add basic validation for orderData if necessary, e.g.,
  if (!orderData || !orderData.userId || !orderData.productIds || !orderData.quantities) {
    throw new ApiError("Invalid order data provided.", 400, orderData);
  }
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error in createOrder:", error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to create order', error.status || 500);
  }
};

export const updateOrderStatus = async (orderId, status, token) => {
  if (!token) throw new ApiError("Authentication token is required.", 401);
  if (!orderId) throw new ApiError("Order ID is required.", 400);
  if (status === undefined || status === null) throw new ApiError("Status is required.", 400);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, { // Assuming PATCH to /orders/{orderId} updates status based on C# controller
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error in updateOrderStatus for ${orderId}:`, error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || `Failed to update order status for ${orderId}`, error.status || 500);
  }
};

/*
export const updateOrder = async (orderId, orderData, token) => {
  if (!token) throw new ApiError("Authentication token is required.", 401);
  if (!orderId) throw new ApiError("Order ID is required.", 400);
  if (!orderData) throw new ApiError("Order data is required for update.", 400);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error in updateOrder for ${orderId}:`, error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || `Failed to update order ${orderId}`, error.status || 500);
  }
};
*/

/*
export const deleteOrder = async (orderId, token) => {
  if (!token) throw new ApiError("Authentication token is required.", 401);
  if (!orderId) throw new ApiError("Order ID is required.", 400);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) {
      return { message: 'Order deleted successfully' };
    }
    return handleResponse(response);
  } catch (error) {
    console.error(`Error in deleteOrder for ${orderId}:`, error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || `Failed to delete order ${orderId}`, error.status || 500);
  }
};
*/
