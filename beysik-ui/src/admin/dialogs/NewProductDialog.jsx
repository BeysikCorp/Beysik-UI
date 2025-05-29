import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid,
  Box, Typography, IconButton, Autocomplete, Chip, FormControl, InputLabel, Select, MenuItem,
  Divider
} from '@mui/material';
import { Add as AddIcon, CloudUpload as CloudUploadIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';

const NewProductDialog = ({
  open,
  onClose,
  newProductData,
  onAdd,
  onChange,
  onImageChange,
  onRemoveImage,
  onAutocompleteChange,
}) => {
  if (!newProductData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <AddIcon sx={{ mr: 1 }} /> Add New Product
      </DialogTitle>
      <DialogContent dividers sx={{'&.MuiDialogContent-root': { paddingTop: '20px' }}}>
        <Box component="form" noValidate autoComplete="off" sx={{ width: '100%' }}> {/* MODIFIED LINE */}

          {/* Section 1: Basic Information */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={newProductData.name}
                onChange={onChange}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={newProductData.category}
                onChange={onChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={newProductData.price}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
                }}
                onChange={onChange}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={newProductData.stock}
                onChange={onChange}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newProductData.status}
                  label="Status"
                  onChange={onChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Section 2: Product Images */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Product Images
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                size="small"
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => onImageChange(e, true)}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {(newProductData.listingImages || []).map((imageSrc, index) => (
                  <Box key={index} sx={{ position: 'relative', border: '1px solid #eee', padding: 0.5, borderRadius: 1 }}>
                    <img
                      src={imageSrc}
                      alt={`New Product Preview ${index + 1}`}
                      style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => onRemoveImage(index, true)}
                      sx={{ position: 'absolute', top: -5, right: -5, backgroundColor: 'rgba(255,255,255,0.8)', '&:hover': { backgroundColor: 'rgba(220,220,220,0.9)' }, p: 0.2 }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Section 3: Variants (Colors & Sizes) */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Variants
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={newProductData.colors || []}
                onChange={(event, newValue) => onAutocompleteChange('colors', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Colors"
                    placeholder="Add colors"
                    size="small"
                    helperText="Type and press Enter to add a color"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={newProductData.sizes || []}
                onChange={(event, newValue) => onAutocompleteChange('sizes', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sizes"
                    placeholder="Add sizes"
                    size="small"
                    helperText="Type and press Enter to add a size"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

            {/* Section 4: Description */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Description
          </Typography>
          <Grid container spacing={3} sx={{ width: '100%' }}> {/* MODIFIED LINE */}
            <Grid item xs={12}>
              <TextField
                fullWidth // This prop makes the TextField span the full width
                multiline
                rows={4} 
                label="Description"
                name="description"
                value={newProductData.description}
                onChange={onChange}
                size="small"
              />
            </Grid>
          </Grid>

        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={onAdd} variant="contained" startIcon={<AddIcon />}>Add Product</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewProductDialog;