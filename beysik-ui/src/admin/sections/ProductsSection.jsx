import React from 'react';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Chip, Tooltip, IconButton
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon,
  Archive as ArchiveIcon, Unarchive as UnarchiveIcon
} from '@mui/icons-material';

const ProductsSection = ({
  products,
  onOpenNewProductDialog,
  onOpenViewProduct,
  onOpenEditProduct,
  onToggleProductStatus
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Product Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onOpenNewProductDialog}
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
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover sx={{ opacity: product.status === 'archived' ? 0.6 : 1 }}>
                <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  {product.id}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {product.listingImages && product.listingImages.length > 0 && (
                      <Box
                        component="img"
                        src={product.listingImages[0]}
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
                <TableCell>${product.price ? product.price.toFixed(2) : '0.00'}</TableCell>
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
                <TableCell>
                  <Chip
                    label={product.status === 'active' ? 'Active' : 'Archived'}
                    size="small"
                    color={product.status === 'active' ? 'success' : 'default'}
                    sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Tooltip title="View">
                      <IconButton size="small" sx={{ mr: 1 }} onClick={() => onOpenViewProduct(product)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => onOpenEditProduct(product)}
                        disabled={product.status === 'archived'}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={product.status === 'active' ? "Archive" : "Unarchive"}>
                      <IconButton
                        size="small"
                        color={product.status === 'active' ? "warning" : "success"}
                        onClick={() => onToggleProductStatus(product.id)}
                      >
                        {product.status === 'active' ? <ArchiveIcon fontSize="small" /> : <UnarchiveIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default ProductsSection;