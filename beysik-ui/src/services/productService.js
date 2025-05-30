const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api"; // Adjusted for Vite and consistency

// Consistent response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to parse error response as JSON, otherwise use statusText
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || JSON.stringify(errorData); // ASP.NET Core might use title for validation errors
    } catch (e) {
      // If parsing fails, stick with statusText or try to read as plain text
      try {
        errorMessage = await response.text() || response.statusText;
      } catch (textError) {
        // Fallback if text() also fails
      }
    }
    throw new Error(`API error: ${response.status} ${errorMessage}`);
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
 * Fetches all active products or products by category/tag.
 * @param {object} params - Optional query parameters (e.g., { category: 'shirts', tag: 'new-arrival' })
 *                         Note: The provided C# backend Get() for all products doesn't show query param handling.
 *                         This frontend part is kept for potential future backend enhancements.
 * @returns {Promise<Array>} - A promise that resolves to an array of products.
 */
export const getAllProducts = async (params = {}) => { // Renamed from getProducts
  const query = new URLSearchParams(params).toString();
  // The C# controller uses route [HttpGet("/products")] directly, not /api/ProductCatalog/products
  const url = `${API_BASE_URL}/products${query ? `?${query}` : ''}`; 
  try {
    console.log(`Fetching products from: ${url}`);
    const response = await fetch(url);
    // No token needed for public product listing as per C# controller
    return handleResponse(response);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw error;
  }
};

/**
 * Fetches a single active product by its ID.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<Object>} - A promise that resolves to the product object.
 */
export const getProductById = async (productId) => {
  // The C# controller uses route [HttpGet("/products/{id:length(24)}")]
  const url = `${API_BASE_URL}/products/${productId}`;
  try {
    console.log(`Fetching product by ID from: ${url}`);
    const response = await fetch(url);
    // No token needed for public product listing
    return handleResponse(response);
  } catch (error) {
    console.error(`Error in getProductById for ${productId}:`, error);
    throw error;
  }
};

/**
 * Creates a new product. (Admin only)
 * @param {Object} productData - The data for the new product.
 * @param {string} token - Auth0 access token.
 * @returns {Promise<Object>} - A promise that resolves to the created product object.
 */
export const addProduct = async (productData, token) => { // Renamed from createProduct for consistency with useAdminLogic
  // The C# controller uses route [HttpPost("/products")]
  const url = `${API_BASE_URL}/products`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error in addProduct:", error);
    throw error;
  }
};

/**
 * Updates an existing product. (Admin only)
 * @param {string} productId - The ID of the product to update.
 * @param {Object} productData - The updated data for the product.
 * @param {string} token - Auth0 access token.
 * @returns {Promise<Object>} - A promise that resolves to the updated product object (or null if 204).
 */
export const updateProduct = async (productId, productData, token) => {
  // The C# controller uses route [HttpPut("/products/{id:length(24)}")]
  const url = `${API_BASE_URL}/products/${productId}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    return handleResponse(response); // PUT might return 204 No Content
  } catch (error) {
    console.error(`Error in updateProduct for ${productId}:`, error);
    throw error;
  }
};

/**
 * Deletes a product (soft delete by setting IsActive to false). (Admin only)
 * @param {string} productId - The ID of the product to delete.
 * @param {string} token - Auth0 access token.
 * @returns {Promise<null>} - A promise that resolves to null on success (204 No Content).
 */
export const deleteProduct = async (productId, token) => {
  // The C# controller uses route [HttpDelete("/products/{id:length(24)}")]
  const url = `${API_BASE_URL}/products/${productId}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response); // DELETE typically returns 204 No Content
  } catch (error) {
    console.error(`Error in deleteProduct for ${productId}:`, error);
    throw error;
  }
};