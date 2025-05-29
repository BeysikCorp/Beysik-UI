// Mock implementation for testing without a backend

/**
 * Sends an order to the backend API.
 * @param {Object} order - The order data.
 * @param {Function} getAccessToken - Function to retrieve the Auth0 access token.
 * @returns {Promise} - Promise that resolves with the API response.
 */
export async function sendOrderToQueue(order, getAccessToken) {
  console.log('Attempting to send order to queue:', order);

  if (typeof getAccessToken !== 'function') {
    console.error('getAccessToken function is required to send order.');
    return Promise.reject(new Error('Authentication token provider is missing or not a function.'));
  }

  try {
    const token = await getAccessToken(); // Use the passed getAccessToken function

    if (!token) {
      console.error('Failed to retrieve access token. Order not sent.');
      return Promise.reject(new Error('Failed to retrieve access token.'));
    }

    // Replace with your actual API endpoint
    const apiUrl = '/api/orders'; // EXAMPLE: Make sure this matches your backend
    
    console.log(`Calling API: POST ${apiUrl} with token.`);
    const response = await fetch(apiUrl, { // Or use axios
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.text(); 
      console.error(`API request failed: ${response.status}`, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }

    const responseData = await response.json();
    console.log('Order successfully sent to queue via API:', responseData);
    return responseData;

  } catch (error) {
    console.error('Error in sendOrderToQueue:', error);
    throw error; 
  }
}

/**
 * Gets order status from the backend API.
 * @param {string} orderId - The order ID to check.
 * @param {Function} getAccessToken - Function to retrieve the Auth0 access token.
 * @returns {Promise} - Promise that resolves with order status.
 */
export async function getOrderStatus(orderId, getAccessToken) {
  console.log('Attempting to get order status for:', orderId);

  if (typeof getAccessToken !== 'function') {
    console.error('getAccessToken function is required to get order status.');
    return Promise.reject(new Error('Authentication token provider is missing or not a function.'));
  }

  try {
    const token = await getAccessToken(); // Use the passed getAccessToken function

    if (!token) {
      console.error('Failed to retrieve access token. Cannot get order status.');
      return Promise.reject(new Error('Failed to retrieve access token.'));
    }

    const apiUrl = `/api/orders/${orderId}/status`; // EXAMPLE: Make sure this matches your backend
    
    console.log(`Calling API: GET ${apiUrl} with token.`);
    const response = await fetch(apiUrl, { // Or use axios
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API request failed: ${response.status}`, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }

    const responseData = await response.json();
    console.log('Order status retrieved via API:', responseData);
    return responseData;

  } catch (error) {
    console.error('Error in getOrderStatus:', error);
    throw error;
  }
}

/**
 * Mock authentication
 */
export async function authenticate(credentials) {
  console.log('Mock: Authenticating user:', credentials.email);
  
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Pre-defined test accounts
      if (credentials.email === 'admin@beysik.com' && credentials.password === 'admin123') {
        resolve({ 
          id: 'admin-1',
          email: credentials.email,
          name: 'Admin User',
          role: 'admin'
        });
      } else if (credentials.email === 'user@beysik.com' && credentials.password === 'user123') {
        resolve({
          id: 'user-1',
          email: credentials.email,
          name: 'Regular User',
          role: 'customer'
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
}

/**
 * Mock user registration
 */
export async function register(userData) {
  console.log('Mock: Registering user:', userData.email);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `user-${Math.floor(Math.random() * 10000)}`,
        email: userData.email,
        name: userData.name,
        role: 'customer',
        createdAt: new Date().toISOString()
      });
    }, 1500);
  });
}