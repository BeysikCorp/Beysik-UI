// d:\_School\Beysik\Beysik-UI\beysik-ui\src\services\cartService.js
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
    return { message: 'Operation successful, no JSON response.'};
  }
};

export const getCart = async (userId, token) => {
  if (!userId) throw new ApiError("User ID is required to fetch cart.", 400);
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error in getCart:", error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to fetch cart', error.status || 500);
  }
};

export const addItemToCart = async (userId, newItem, token) => {
  if (!userId) throw new ApiError("User ID is required to add item to cart.", 400);
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newItem),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error in addItemToCart:", error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to add item to cart', error.status || 500);
  }
};

export const updateCartItem = async (itemId, updatedItem, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedItem),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error in updateCartItem for ${itemId}:`, error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || `Failed to update item ${itemId}`, error.status || 500);
  }
};

export const removeCartItem = async (itemId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 204) {
      return { message: 'Item removed successfully' };
    }
    return handleResponse(response); 
  } catch (error) {
    console.error(`Error in removeCartItem for ${itemId}:`, error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || `Failed to remove item ${itemId}`, error.status || 500);
  }
};

/*
export const clearCart = async (userId, token) => {
  if (!userId) throw new ApiError("User ID is required to clear cart.", 400);
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 204) {
      return { message: 'Cart cleared successfully' };
    }
    return handleResponse(response);
  } catch (error) {
    console.error(`Error in clearCart for user ${userId}:`, error.message, error.status ? `Status: ${error.status}` : '', error.details ? `Details: ${JSON.stringify(error.details)}` : '');
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to clear cart', error.status || 500);
  }
};
*/
