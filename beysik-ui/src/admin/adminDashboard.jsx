import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Chip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ShoppingBag as ShoppingBagIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import '../styles/adminDashboard.css';
import allProducts from '../data/products.json';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog state
  const [editDialog, setEditDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(allProducts);
      
      // Get orders from localStorage instead of mock data
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
      
      // Users can also be loaded from localStorage if you implement user management
      setUsers([
        { id: '101', name: 'Jane Doe', email: 'jane@example.com', role: 'customer', joinDate: '2023-09-01' },
        { id: '102', name: 'John Smith', email: 'john@example.com', role: 'customer', joinDate: '2023-09-15' },
        { id: '103', name: 'Admin User', email: 'admin@beysik.com', role: 'admin', joinDate: '2023-08-01' }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setEditDialog(true);
  };
  
  const handleSaveProduct = () => {
    // Here you would normally send the updated product to your API
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === currentProduct.id ? currentProduct : p)
    );
    setEditDialog(false);
  };
  
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Calculate summary statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Processing').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your products, orders, and users
        </Typography>
      </Box>
      
      {/* Dashboard Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="admin-stat-card" elevation={0} sx={{ backgroundColor: '#F8F9FA', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Products
                </Typography>
                <Box sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', p: 1, borderRadius: '50%' }}>
                  <ShoppingBagIcon color="primary" />
                </Box>
              </Box>
              <Typography variant="h4">{products.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Across {new Set(products.map(p => p.category)).size} categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="admin-stat-card" elevation={0} sx={{ backgroundColor: '#F8F9FA', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Orders
                </Typography>
                <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', p: 1, borderRadius: '50%' }}>
                  <TrendingUpIcon color="success" />
                </Box>
              </Box>
              <Typography variant="h4">{orders.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {pendingOrders} pending orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="admin-stat-card" elevation={0} sx={{ backgroundColor: '#F8F9FA', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Box sx={{ bgcolor: 'rgba(147, 125, 100, 0.1)', p: 1, borderRadius: '50%' }}>
                  <AttachMoneyIcon sx={{ color: '#937D64' }} />
                </Box>
              </Box>
              <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                From {orders.length} orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="admin-stat-card" elevation={0} sx={{ backgroundColor: '#F8F9FA', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Users
                </Typography>
                <Box sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', p: 1, borderRadius: '50%' }}>
                  <PeopleIcon color="error" />
                </Box>
              </Box>
              <Typography variant="h4">{users.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {users.filter(u => u.role === 'admin').length} admins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden', mb: 4, border: '1px solid #EBEBEB' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin tabs"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                fontWeight: 500
              }
            }}
          >
            <Tab label="Products" />
            <Tab label="Orders" />
            <Tab label="Users" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Product Management</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
            >
              Add New Product
            </Button>
          </Box>
          
          <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #EBEBEB' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {product.id}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {product.listingImage && (
                          <Box 
                            component="img" 
                            src={product.listingImage}
                            alt={product.name}
                            sx={{ width: 40, height: 40, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                          />
                        )}
                        <Typography variant="body2">{product.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        sx={{ backgroundColor: '#F8F9FA', fontWeight: 500, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">{product.stock}</Typography>
                        {product.stock < 10 && (
                          <Chip 
                            label="Low" 
                            size="small" 
                            color="error" 
                            sx={{ ml: 1, height: '20px', fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="View">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            sx={{ mr: 1 }}
                            onClick={() => handleEditProduct(product)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>

        {/* Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Order Management</Typography>
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="order-status-filter">Filter by Status</InputLabel>
              <Select
                labelId="order-status-filter"
                label="Filter by Status"
                defaultValue="All"
              >
                <MenuItem value="All">All Orders</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #EBEBEB' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {order.id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        size="small" 
                        color={order.status === 'Delivered' ? 'success' : 
                               order.status === 'Shipped' ? 'primary' : 'warning'}
                        sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">User Management</Typography>
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="user-role-filter">Filter by Role</InputLabel>
              <Select
                labelId="user-role-filter"
                label="Filter by Role"
                defaultValue="All"
              >
                <MenuItem value="All">All Users</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #EBEBEB' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {user.id}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        size="small" 
                        color={user.role === 'admin' ? 'error' : 'default'}
                        sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="View">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Site Settings</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                General Settings
              </Typography>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #EBEBEB' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Site Name"
                      defaultValue="Beysik"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Site Description"
                      defaultValue="Minimalist fashion essentials"
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Currency</InputLabel>
                      <Select
                        defaultValue="USD"
                        label="Currency"
                      >
                        <MenuItem value="USD">USD ($)</MenuItem>
                        <MenuItem value="EUR">EUR (€)</MenuItem>
                        <MenuItem value="GBP">GBP (£)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Email Settings
              </Typography>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid #EBEBEB' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Admin Email"
                      defaultValue="admin@beysik.com"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Order Notifications</InputLabel>
                      <Select
                        defaultValue="all"
                        label="Order Notifications"
                      >
                        <MenuItem value="all">All Orders</MenuItem>
                        <MenuItem value="new">New Orders Only</MenuItem>
                        <MenuItem value="none">Disabled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" sx={{ mr: 2 }}>Cancel</Button>
                    <Button variant="contained">Save Changes</Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Edit Product Dialog */}
      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent dividers>
          {currentProduct && (
            <Box component="form" sx={{ mt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleProductChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    value={currentProduct.category}
                    onChange={handleProductChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={currentProduct.price}
                    InputProps={{
                      startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                    }}
                    onChange={handleProductChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock"
                    name="stock"
                    type="number"
                    value={currentProduct.stock}
                    onChange={handleProductChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={currentProduct.status || 'active'}
                      onChange={handleProductChange}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={currentProduct.description}
                    onChange={handleProductChange}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditDialog(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;