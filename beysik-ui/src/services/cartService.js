// d:\_School\Beysik\Beysik-UI\beysik-ui\src\services\cartService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'; // Ensure this matches your cart service endpoint structure

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // For 204 No Content, there might not be a JSON body
  if (response.status === 204) {
    return null; 
  }
  try {
    return await response.json();
  } catch (e) {
    // If response is OK but not JSON (e.g. plain text confirmation for delete)
    return { message: 'Operation successful, no JSON response.'};
  }
};

// Corresponds to [HttpGet("{userId}")]
export const getCart = async (userId, token) => {
  if (!userId) throw new Error("User ID is required to fetch cart.");
  const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Corresponds to [HttpPost("items")]
// Note: Backend expects userId as a query param and newItem in body
export const addItemToCart = async (userId, newItem, token) => {
  if (!userId) throw new Error("User ID is required to add item to cart.");
  const response = await fetch(`${API_BASE_URL}/cart/items?userId=${encodeURIComponent(userId)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(newItem),
  });
  return handleResponse(response);
};

// Corresponds to [HttpPut("items/{id}")]
// Note: Backend expects item id in path and updatedItem in body
export const updateCartItem = async (itemId, updatedItem, token) => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedItem),
  });
  return handleResponse(response);
};

// Corresponds to [HttpDelete("items/{id}")]
// Note: Backend expects item id in path
export const removeCartItem = async (itemId, token) => {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // DELETE might return 204 No Content or a success message
   if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.status === 204 ? { message: 'Item removed successfully' } : handleResponse(response);
};

// Optional: A function to clear the entire cart for a user if the backend supports it.
// This is a common feature but not explicitly in the C# controller provided.
// If you add a `DELETE api/cart/{userId}` endpoint, you could implement this:
/*
export const clearCart = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
*/
