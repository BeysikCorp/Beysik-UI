// Mock implementation for testing without a backend

/**
 * Simulates sending an order to a queue
 * @param {Object} order - The order data
 * @returns {Promise} - Promise that resolves when order is sent to queue
 */
export async function sendOrderToQueue(order) {
  console.log('Mock: Sending order to queue:', order);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock: Order successfully queued');
      // Save to localStorage for persistence
      const orders = JSON.parse(localStorage.getItem('beysikOrders') || '[]');
      orders.push({
        ...order,
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('beysikOrders', JSON.stringify(orders));
      resolve({ success: true, orderId: order.id });
    }, 1500);
  });
}

/**
 * Simulates getting order status
 * @param {string} orderId - The order ID to check
 * @returns {Promise} - Promise that resolves with order status
 */
export async function getOrderStatus(orderId) {
  console.log('Mock: Getting order status for:', orderId);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem('beysikOrders') || '[]');
      const order = orders.find(o => o.id === orderId);
      
      if (order) {
        resolve({ 
          status: order.status || 'processing',
          lastUpdated: new Date().toISOString()
        });
      } else {
        resolve({ status: 'not_found' });
      }
    }, 800);
  });
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


// import axios from 'axios';

// // Backend API base URL - Replace with your actual backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// /**
//  * Send an order to the queue for processing
//  * @param {Object} order - The order data
//  * @returns {Promise} - Promise that resolves when order is sent to queue
//  */
// export async function sendOrderToQueue(order) {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/orders/queue`, order);
//     return response.data;
//   } catch (error) {
//     console.error('Error sending order to queue:', error);
//     throw error;
//   }
// }

// /**
//  * Get order status from the backend
//  * @param {string} orderId - The order ID to check
//  * @returns {Promise} - Promise that resolves with order status
//  */
// export async function getOrderStatus(orderId) {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/status`);
//     return response.data;
//   } catch (error) {
//     console.error('Error getting order status:', error);
//     throw error;
//   }
// }

// /**
//  * Send authentication request to backend
//  * @param {Object} credentials - User credentials
//  * @returns {Promise} - Promise that resolves with auth response
//  */
// export async function authenticate(credentials) {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
//     return response.data;
//   } catch (error) {
//     console.error('Authentication error:', error);
//     throw error;
//   }
// }

// /**
//  * Register a new user with the backend
//  * @param {Object} userData - User registration data
//  * @returns {Promise} - Promise that resolves with registration response
//  */
// export async function register(userData) {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
//     return response.data;
//   } catch (error) {
//     console.error('Registration error:', error);
//     throw error;
//   }
// }