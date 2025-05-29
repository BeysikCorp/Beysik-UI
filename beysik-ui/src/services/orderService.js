// Filepath: d:\_School\Beysik\Beysik-UI\beysik-ui\src\services\orderService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'; // Standardized to VITE_API_BASE_URL

// Consistent response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // For 204 No Content, there might not be a JSON body
  if (response.status === 204) {
    return null; 
  }
  // For other successful responses, try to parse JSON
  // If backend sends non-JSON success response for some operations, adjust as needed
  try {
    return await response.json();
  } catch (e) {
    // If response is OK but not JSON (e.g. plain text confirmation)
    return { message: 'Operation successful, no JSON content.' };
  }
};

export const getAllOrders = async (token) => { // Renamed from getOrders for clarity, token passed directly
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getOrderById = async (orderId, token) => { // token passed directly
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const createOrder = async (orderData, token) => {
  // orderData should include: userId, productIds (array), quantities (array), orderDate (string)
  // The backend Order model has: OrderID (auto), OrderDate, UserID, ProductID (List<string>), Quantity (List<int>), Status (auto-set to Pending)
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData), // e.g., { userId: "user123", productIds: ["prod1", "prod2"], quantities: [1, 2], orderDate: "2024-05-30" }
  });
  return handleResponse(response);
};

export const updateOrderStatus = async (orderId, status, token) => { // token passed directly
  // Assuming backend handles PATCH to update just the status.
  // The C# OrderService has Update(Order order) which might expect the full order.
  // If PATCH isn't supported for status alone, this needs to fetch the order, update status, then PUT the whole order.
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, { // Or a more specific endpoint like /orders/${orderId}/status
    method: 'PATCH', 
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }), // status should be the integer value (0, 1, or 2)
  });
  return handleResponse(response);
};

// If a full update of an order is needed (not just status):
/*
export const updateOrder = async (orderId, orderData, token) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData), // Send the full updated order object
  });
  return handleResponse(response);
};
*/

// No explicit deleteOrder in the C# service, but if added:
/*
export const deleteOrder = async (orderId, token) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
*/
