import { useState, useEffect, useCallback } from 'react';
import { getAllProducts, addProduct as apiAddProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '../../services/productService';
import { getAllOrders, getOrderById as apiGetOrderById , updateOrderStatus as apiUpdateOrderStatus } from '../../services/orderService'; // Assuming updateOrderStatus exists
import { getAllUsers, updateUserRole as apiUpdateUserRole, deleteUser as apiDeleteUser } from '../../services/userService'; // Assuming these functions
import { useAuth } from '../../context/AuthContext'; // Corrected import

const useAdminLogic = () => {
  const { getAccessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (serviceFunc, setter, entityName) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Authentication token not available.');
      }
      const data = await serviceFunc(token);
      setter(data);
    } catch (err) {
      console.error(`Error fetching ${entityName}:`, err);
      setError(`Failed to fetch ${entityName}. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchData(getAllProducts, setProducts, 'products');
    fetchData(getAllOrders, setOrders, 'orders');
    fetchData(getAllUsers, setUsers, 'users');
  }, [fetchData]);

  const addProduct = async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      // Handle image upload if productData.image is a File object
      // For now, assuming productData.image is a URL or base64 string
      // If it's a file, you'd upload it first, get the URL, then save the product
      
      // If productData.image is a File object, you might want to upload it first.
      // This is a placeholder for actual file upload logic.
      // For now, we assume the image is a data URL or already a URL.
      // if (productData.image instanceof File) {
      //   // const imageUrl = await uploadImageToServer(productData.image, token);
      //   // productData.image = imageUrl; // Or however your backend expects it
      //   console.warn("Image is a File object - actual upload logic needed here.");
      // }


      const newProduct = await apiAddProduct(productData, token);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(`Failed to add product. ${err.message}`);
      throw err; // Re-throw to allow form to handle it
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      // Similar to addProduct, handle image if it's a new file
      // if (productData.image instanceof File) {
      //   // const imageUrl = await uploadImageToServer(productData.image, token);
      //   // productData.image = imageUrl;
      //    console.warn("Image is a File object - actual upload logic needed here for update.");
      // }
      const updatedProduct = await apiUpdateProduct(productId, productData, token);
      setProducts(prev => prev.map(p => p._id === productId ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      setError(`Failed to update product. ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      await apiDeleteProduct(productId, token);
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(`Failed to delete product. ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getOrderById = async (orderId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const order = await apiGetOrderById(orderId, token);
      // Potentially update a local state for a single viewed order or just return
      return order;
    } catch (err) {
      console.error(`Error fetching order ${orderId}:`, err);
      setError(`Failed to fetch order ${orderId}. ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const updateOrderStatus = async (orderId, status) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const updatedOrder = await apiUpdateOrderStatus(orderId, status, token);
      setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
      return updatedOrder;
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(`Failed to update order status. ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const updatedUser = await apiUpdateUserRole(userId, role, token);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: updatedUser.role } : u)); // Assuming backend returns updated user or just role
      return updatedUser;
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(`Failed to update user role. ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      await apiDeleteUser(userId, token);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(`Failed to delete user. ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    orders,
    users,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getOrderById,
    updateOrderStatus,
    updateUserRole,
    deleteUser,
    fetchData, // Expose fetchData if needed for manual refresh
  };
};

export default useAdminLogic;