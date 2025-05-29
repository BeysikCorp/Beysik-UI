import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
  Box, Typography, Chip, Divider
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const ViewProductDialog = ({ open, onClose, productToView }) => {
  if (!productToView) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <VisibilityIcon sx={{ mr: 1 }} /> Product Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">Images</Typography>
            {productToView.listingImages && productToView.listingImages.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {productToView.listingImages.map((imgSrc, idx) => (
                  <Box key={idx} sx={{ textAlign: 'center', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                    <img
                      src={imgSrc}
                      alt={`${productToView.name} - Image ${idx + 1}`}
                      style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px' }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>No images available.</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">{productToView.name}</Typography>
            <Chip
              label={productToView.status === 'active' ? 'Active' : productToView.status === 'archived' ? 'Archived' : 'Draft'}
              size="small"
              color={productToView.status === 'active' ? 'success' : productToView.status === 'archived' ? 'default' : 'info'}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>ID:</strong> {productToView.id}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Category:</strong> {productToView.category}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold', my: 1.5 }}>
              ${productToView.price ? productToView.price.toFixed(2) : 'N/A'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>Stock:</strong> {productToView.stock} units
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Colors:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
              {productToView.colors && productToView.colors.length > 0
                ? productToView.colors.map(color => <Chip key={color} label={color} size="small" variant="outlined" />)
                : <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>N/A</Typography>}
            </Box>

            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Sizes:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {productToView.sizes && productToView.sizes.length > 0
                ? productToView.sizes.map(size => <Chip key={size} label={size} size="small" variant="outlined" />)
                : <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>N/A</Typography>}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Description:</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
              {productToView.description || 'No description available.'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProductDialog;