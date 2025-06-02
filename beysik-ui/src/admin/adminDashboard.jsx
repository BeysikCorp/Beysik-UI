import React from 'react';
import {
  Container, Typography, Box, Tabs, Tab, Paper, CircularProgress, Grid, Card, CardContent
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon, People as PeopleIcon, AttachMoney as AttachMoneyIcon, TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import '../styles/adminDashboard.css';
import TabPanel from './components/TabPanel';
import useAdminLogic from './hooks/useAdminLogic';
import ProductsSection from './sections/ProductsSection';
import OrdersSection from './sections/OrdersSection';
import UsersSection from './sections/UsersSection';
import SettingsSection from './sections/SettingsSection';
import EditProductDialog from './dialogs/EditProductDialog';
import NewProductDialog from './dialogs/NewProductDialog';
import ViewProductDialog from './dialogs/ViewProductDialog';

const AdminDashboard = () => {
  const {
    tabValue, handleTabChange,
    products,
    orders,
    users,
    loading,
    error,
    editDialog, setEditDialog,
    currentProduct, setCurrentProduct,
    newProductDialog, setNewProductDialog,
    newProductData, setNewProductData, initialNewProductState,
    viewProductDialog, setViewProductDialog,
    productToView,
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
  } = useAdminLogic();

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
                <Typography variant="subtitle2" color="text.secondary">Total Products</Typography>
                <Box sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)', p: 1, borderRadius: '50%' }}><ShoppingBagIcon color="primary" /></Box>
              </Box>
              <Typography variant="h4">{products.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Across {new Set(products.map(p => p.category)).size} categories</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="admin-stat-card" elevation={0} sx={{ backgroundColor: '#F8F9FA', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Orders</Typography>
                <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', p: 1, borderRadius: '50%' }}><TrendingUpIcon color="success" /></Box>
              </Box>
              <Typography variant="h4">{orders.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{pendingOrders} pending orders</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="admin-stat-card" elevation={0} sx={{ backgroundColor: '#F8F9FA', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Revenue</Typography>
                <Box sx={{ bgcolor: 'rgba(147, 125, 100, 0.1)', p: 1, borderRadius: '50%' }}><AttachMoneyIcon sx={{ color: '#937D64' }} /></Box>
              </Box>
              <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>From {orders.length} orders</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="admin-stat-card" elevation={0} sx={{ backgroundColor: '#F8F9FA', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
                <Box sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', p: 1, borderRadius: '50%' }}><PeopleIcon color="error" /></Box>
              </Box>
              <Typography variant="h4">{users.length}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{users.filter(u => u.role === 'admin').length} admins</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden', mb: 4, border: '1px solid #EBEBEB' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#F8F9FA' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs" sx={{ '& .MuiTab-root': { py: 2, fontWeight: 500 }}}>
            <Tab label="Products" />
            <Tab label="Orders" />
            <Tab label="Users" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ProductsSection
            products={products}
            onOpenNewProductDialog={handleOpenNewProductDialog}
            onOpenViewProduct={handleOpenViewProduct}
            onOpenEditProduct={handleOpenEditProduct}
            onToggleProductStatus={handleToggleProductStatus}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <OrdersSection orders={orders} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UsersSection users={users} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <SettingsSection />
        </TabPanel>
      </Paper>

      <EditProductDialog
        open={editDialog}
        onClose={() => { setEditDialog(false); setCurrentProduct(null); }}
        currentProduct={currentProduct}
        onSave={handleSaveProduct}
        onChange={handleProductChange}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
        onAutocompleteChange={handleCurrentProductAutocompleteChange}
      />

      <NewProductDialog
        open={newProductDialog}
        onClose={() => setNewProductDialog(false)}
        newProductData={newProductData}
        onAdd={handleAddNewProduct}
        onChange={handleNewProductChange}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
        onAutocompleteChange={handleNewProductAutocompleteChange}
        initialNewProductState={initialNewProductState}
        setNewProductData={setNewProductData}
      />

      <ViewProductDialog
        open={viewProductDialog}
        onClose={() => setViewProductDialog(false)}
        productToView={productToView}
      />
    </Container>
  );
};

export default AdminDashboard;