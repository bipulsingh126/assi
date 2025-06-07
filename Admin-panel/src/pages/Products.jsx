import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Tooltip, LinearProgress,
  Alert, Snackbar, FormControlLabel, Switch,
  Grid, Card, CardMedia, FormHelperText,
  Chip, Autocomplete, Tabs, Tab, Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Clear as ClearIcon,
  Link as LinkIcon,
  LocalShipping as ShippingIcon,
  Category as CategoryIcon,
  LocationCity as LocationIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { productsAPI } from '../services/api';

// Sample data for dropdowns
const BRANDS = [
  'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 
  'Nissan', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Chevrolet', 'Lexus'
];

const CATEGORIES = [
  'Engine Parts', 'Exterior', 'Interior', 'Lighting', 'Wheels & Tires',
  'Brakes', 'Suspension', 'Electrical', 'Accessories', 'Performance'
];

const SUB_CATEGORIES = {
  'Engine Parts': ['Pistons', 'Gaskets', 'Belts', 'Filters', 'Pumps'],
  'Exterior': ['Body Kits', 'Mirrors', 'Grills', 'Bumpers', 'Hoods'],
  'Interior': ['Seats', 'Steering Wheels', 'Floor Mats', 'Gauges', 'Consoles'],
  'Lighting': ['Headlights', 'Taillights', 'Fog Lights', 'LED Kits', 'Bulbs'],
  'Wheels & Tires': ['Alloy Wheels', 'Steel Wheels', 'Summer Tires', 'Winter Tires', 'All-Season'],
  'Brakes': ['Pads', 'Rotors', 'Calipers', 'Lines', 'Master Cylinders'],
  'Suspension': ['Shocks', 'Springs', 'Struts', 'Control Arms', 'Bushings'],
  'Electrical': ['Batteries', 'Alternators', 'Starters', 'Sensors', 'Switches'],
  'Accessories': ['Floor Mats', 'Seat Covers', 'Audio', 'Navigation', 'Phone Mounts'],
  'Performance': ['Exhaust', 'Intake', 'Tuning', 'Turbo', 'Superchargers']
};

const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    brand: '',
    stock: '',
    inStock: true,
    images: [],
    deliveryTime: 3,
    affiliateLink: '',
    vehicleCompatibility: {
      brand: '',
      model: '',
      year: ''
    },
    cityAvailability: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load products',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (currentProduct.category && SUB_CATEGORIES[currentProduct.category]) {
      setSubCategories(SUB_CATEGORIES[currentProduct.category]);
    } else {
      setSubCategories([]);
    }
  }, [currentProduct.category]);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct({
        ...product,
        vehicleCompatibility: product.vehicleCompatibility || { brand: '', model: '', year: '' },
        cityAvailability: product.cityAvailability || []
      });
      setImageUrls(product.images || []);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        brand: '',
        stock: '',
        inStock: true,
        images: [],
        deliveryTime: 3,
        affiliateLink: '',
        vehicleCompatibility: {
          brand: '',
          model: '',
          year: ''
        },
        cityAvailability: []
      });
      setImageUrls([]);
      setIsEditing(false);
    }
    setTabValue(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: type === 'checkbox' 
        ? checked 
        : (name === 'price' || name === 'stock' || name === 'deliveryTime') 
          ? Number(value) 
          : value
    });
  };

  const handleVehicleChange = (field, value) => {
    setCurrentProduct({
      ...currentProduct,
      vehicleCompatibility: {
        ...currentProduct.vehicleCompatibility,
        [field]: value
      }
    });
  };

  const handleCityChange = (_, values) => {
    setCurrentProduct({
      ...currentProduct,
      cityAvailability: values
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, imageUrl]);
      
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setCurrentProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
      setSnackbar({
        open: true,
        message: 'Name, price and category are required',
        severity: 'error'
      });
      return;
    }

    try {
      if (isEditing) {
        // Update existing product
        const response = await productsAPI.updateProduct(currentProduct._id, currentProduct);
        setProducts(products.map(p => 
          p._id === currentProduct._id ? response.data : p
        ));
        setSnackbar({
          open: true,
          message: 'Product updated successfully',
          severity: 'success'
        });
      } else {
        // Add new product
        const response = await productsAPI.createProduct(currentProduct);
        setProducts([...products, response.data]);
        setSnackbar({
          open: true,
          message: 'Product added successfully',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save product',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete product',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Basic Info
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Product Name"
                name="name"
                fullWidth
                value={currentProduct.name}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={currentProduct.price}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                margin="dense"
                label="Stock"
                name="stock"
                type="number"
                fullWidth
                value={currentProduct.stock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={currentProduct.inStock}
                    onChange={handleChange}
                    name="inStock"
                    color="primary"
                  />
                }
                label="In Stock"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Description"
                name="description"
                multiline
                rows={4}
                fullWidth
                value={currentProduct.description}
                onChange={handleChange}
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Product Images</Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                    sx={{ mt: 1 }}
                  >
                    Upload Images
                  </Button>
                </label>
                <FormHelperText>You can upload multiple images</FormHelperText>
              </Box>
              
              {imageUrls.length > 0 && (
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {imageUrls.map((url, index) => (
                    <Grid item xs={4} key={index}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={url}
                          alt={`Product image ${index + 1}`}
                          sx={{ objectFit: 'cover' }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: 'rgba(255,255,255,0.7)'
                          }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        );
      
      case 1: // Categories & Brand
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={CATEGORIES}
                value={currentProduct.category}
                onChange={(_, value) => {
                  setCurrentProduct({
                    ...currentProduct,
                    category: value || '',
                    subCategory: ''
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Main Category"
                    margin="dense"
                    required
                  />
                )}
              />
              
              <Autocomplete
                options={subCategories}
                value={currentProduct.subCategory}
                onChange={(_, value) => {
                  setCurrentProduct({
                    ...currentProduct,
                    subCategory: value || ''
                  });
                }}
                disabled={!currentProduct.category}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Category"
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={BRANDS}
                value={currentProduct.brand}
                onChange={(_, value) => {
                  setCurrentProduct({
                    ...currentProduct,
                    brand: value || ''
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Brand"
                    margin="dense"
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      
      case 2: // Vehicle Compatibility
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Vehicle Compatibility (Optional)
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                margin="dense"
                label="Vehicle Brand"
                fullWidth
                value={currentProduct.vehicleCompatibility.brand}
                onChange={(e) => handleVehicleChange('brand', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                margin="dense"
                label="Vehicle Model"
                fullWidth
                value={currentProduct.vehicleCompatibility.model}
                onChange={(e) => handleVehicleChange('model', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                margin="dense"
                label="Year"
                fullWidth
                value={currentProduct.vehicleCompatibility.year}
                onChange={(e) => handleVehicleChange('year', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      
      case 3: // Shipping & Availability
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                label="Delivery Time (days)"
                name="deliveryTime"
                type="number"
                fullWidth
                value={currentProduct.deliveryTime}
                onChange={handleChange}
                inputProps={{ min: 1 }}
              />
              
              <TextField
                margin="dense"
                label="Affiliate Purchase Link"
                name="affiliateLink"
                fullWidth
                value={currentProduct.affiliateLink}
                onChange={handleChange}
                placeholder="https://..."
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={CITIES}
                value={currentProduct.cityAvailability}
                onChange={handleCityChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City Availability"
                    margin="dense"
                    placeholder="Select cities"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found. Add your first product!
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.brand || 'N/A'}</TableCell>
                    <TableCell>
                      {product.category}
                      {product.subCategory && ` / ${product.subCategory}`}
                    </TableCell>
                    <TableCell>${product.price?.toFixed(2)}</TableCell>
                    <TableCell>{product.deliveryTime || 'N/A'} days</TableCell>
                    <TableCell>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenDialog(product)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(product._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Product Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<CategoryIcon />} label="Basic Info" />
          <Tab icon={<CategoryIcon />} label="Categories & Brand" />
          <Tab icon={<CarIcon />} label="Vehicle Compatibility" />
          <Tab icon={<ShippingIcon />} label="Shipping & Availability" />
        </Tabs>
        <DialogContent>
          {renderTabContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 