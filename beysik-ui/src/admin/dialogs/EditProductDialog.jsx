import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid,
  Box, Typography, IconButton, Autocomplete, Chip, FormControl, InputLabel, Select, MenuItem,
  Divider // Added Divider
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, CloudUpload as CloudUploadIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';

const EditProductDialog = ({
  open,
  onClose,
  currentProduct,
  onSave,
  onChange,
  onImageChange,
  onRemoveImage,
  onAutocompleteChange
}) => {
  if (!currentProduct) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <EditIcon sx={{ mr: 1 }} /> Edit Product
      </DialogTitle>
      <DialogContent dividers sx={{'&.MuiDialogContent-root': { paddingTop: '20px' }}}> {/* Added top padding */}
        <Box component="form" noValidate autoComplete="off">
          
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
                value={currentProduct.name}
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
                value={currentProduct.category}
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
                value={currentProduct.price}
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
                value={currentProduct.stock}
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
                  value={currentProduct.status || 'active'}
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
                  onChange={(e) => onImageChange(e, false)}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {(currentProduct.listingImages || []).map((imageSrc, index) => (
                  <Box key={index} sx={{ position: 'relative', border: '1px solid #eee', padding: 0.5, borderRadius: 1 }}>
                    <img
                      src={imageSrc}
                      alt={`Preview ${index + 1}`}
                      style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => onRemoveImage(index, false)}
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
                value={currentProduct.colors || []}
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
                value={currentProduct.sizes || []}
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4} // Slightly increased rows for better UX
                label="Description"
                name="description"
                value={currentProduct.description}
                onChange={onChange}
                size="small"
              />
            </Grid>
          </Grid>

        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={onSave} variant="contained" startIcon={<SaveIcon />}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;