import { useState, useEffect, useCallback } from 'react';
import allProductsData from '../../data/products.json';

const initialNewProductState = {
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: '',
  listingImages: [],
  status: 'active',
  colors: [],
  sizes: [],
};

export const useAdminLogic = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editDialog, setEditDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProductDialog, setNewProductDialog] = useState(false);
  const [newProductData, setNewProductData] = useState(initialNewProductState);
  const [viewProductDialog, setViewProductDialog] = useState(false);
  const [productToView, setProductToView] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        const initialProducts = allProductsData.map(p => ({
          ...p,
          id: p.id || `prod-${Math.random().toString(36).substr(2, 9)}`,
          status: p.status || 'active',
          listingImages: p.listingImages || (p.listingImage ? [p.listingImage] : []),
          colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? p.colors.split(',').map(c => c.trim()).filter(Boolean) : []),
          sizes: Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? p.sizes.split(',').map(s => s.trim()).filter(Boolean) : []),
        }));
        setProducts(initialProducts);

        const savedOrders = JSON.parse(localStorage.getItem('beysikOrders') || '[]')
          .map(order => ({
            id: order.id || Math.random().toString(36).substring(2, 10),
            customer: `${order.user?.name || 'Guest User'}`,
            date: new Date(order.createdAt).toLocaleDateString(),
            total: parseFloat(order.payment?.total || 0),
            status: order.status || 'Processing'
          }));

        setOrders(savedOrders.length > 0 ? savedOrders : [
          { id: '1001', customer: 'Jane Doe', total: 145.90, date: '2023-10-15', status: 'Delivered' },
          { id: '1002', customer: 'John Smith', total: 89.75, date: '2023-10-17', status: 'Shipped' },
          { id: '1003', customer: 'Alice Johnson', total: 210.50, date: '2023-10-18', status: 'Processing' }
        ]);

        setUsers([
          { id: '101', name: 'Jane Doe', email: 'jane@example.com', role: 'customer', joinDate: '2023-09-01' },
          { id: '102', name: 'John Smith', email: 'john@example.com', role: 'customer', joinDate: '2023-09-15' },
          { id: '103', name: 'Admin User', email: 'admin@beysik.com', role: 'admin', joinDate: '2023-08-01' }
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load initial data.');
        setLoading(false);
        console.error(err);
      }
    }, 1000);
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  const handleImageChange = useCallback((event, isNewProduct = false) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const processFiles = (currentImagesStateSetter) => {
      const imagePromises = files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(newImageDataUrls => {
        currentImagesStateSetter(prev => ({
          ...prev,
          listingImages: [...(prev.listingImages || []), ...newImageDataUrls]
        }));
      }).catch(err => console.error("Error reading files:", err));
    };

    if (isNewProduct) {
      processFiles(setNewProductData);
    } else if (currentProduct) {
      processFiles(setCurrentProduct);
    }
    event.target.value = null;
  }, [currentProduct]);

  const handleRemoveImage = useCallback((index, isNewProduct) => {
    if (isNewProduct) {
      setNewProductData(prev => ({
        ...prev,
        listingImages: prev.listingImages.filter((_, i) => i !== index)
      }));
    } else {
      setCurrentProduct(prev => ({
        ...prev,
        listingImages: prev.listingImages.filter((_, i) => i !== index)
      }));
    }
  }, []);

  const handleOpenEditProduct = useCallback((product) => {
    setCurrentProduct({
      ...product,
      listingImages: Array.isArray(product.listingImages) ? product.listingImages : (product.listingImage ? [product.listingImage] : []),
      colors: Array.isArray(product.colors) ? product.colors : [],
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
    });
    setEditDialog(true);
  }, []);

  const handleSaveProduct = useCallback(() => {
    if (!currentProduct) return;
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === currentProduct.id ? { ...currentProduct } : p))
    );
    setEditDialog(false);
    setCurrentProduct(null);
  }, [currentProduct]);

  const handleProductChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  }, []);
  
  const handleCurrentProductAutocompleteChange = useCallback((field, newValue) => {
    setCurrentProduct(prev => ({
      ...prev,
      [field]: newValue
    }));
  }, []);

  const handleOpenNewProductDialog = useCallback(() => {
    setNewProductData({
        ...initialNewProductState,
        listingImages: [], 
        colors: [],
        sizes: [],
    });
    setNewProductDialog(true);
  }, []);

  const handleNewProductChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewProductData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  }, []);

  const handleNewProductAutocompleteChange = useCallback((field, newValue) => {
    setNewProductData(prev => ({
      ...prev,
      [field]: newValue
    }));
  }, []);

  const handleAddNewProduct = useCallback(() => {
    const newId = `prod-${Math.random().toString(36).substr(2, 9)}`;
    const productToAdd = {
      ...newProductData,
      id: newId,
    };
    setProducts(prevProducts => [productToAdd, ...prevProducts]);
    setNewProductDialog(false);
  }, [newProductData]);

  const handleOpenViewProduct = useCallback((product) => {
    setProductToView(product);
    setViewProductDialog(true);
  }, []);

  const handleToggleProductStatus = useCallback((productId) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, status: p.status === 'active' ? 'archived' : 'active' } : p
      )
    );
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Processing').length;

  return {
    tabValue, handleTabChange,
    products, setProducts,
    orders,
    users,
    loading,
    error,
    editDialog, setEditDialog,
    currentProduct, setCurrentProduct,
    newProductDialog, setNewProductDialog,
    newProductData, setNewProductData, initialNewProductState,
    viewProductDialog, setViewProductDialog,
    productToView, setProductToView,
    handleImageChange,
    handleRemoveImage,
    handleOpenEditProduct,
    handleSaveProduct,
    handleProductChange,
    handleCurrentProductAutocompleteChange,
    handleOpenNewProductDialog,
    handleNewProductChange,
    handleNewProductAutocompleteChange,
    handleAddNewProduct,
    handleOpenViewProduct,
    handleToggleProductStatus,
    totalRevenue,
    pendingOrders
  };
};