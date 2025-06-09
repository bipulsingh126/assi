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
  'Brakes', 'Suspension', 'Electrical', 'Accessories', 'Performance',
  'Architectural', 'Industrial', 'Transportation', 'Custom'
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
  'Performance': ['Exhaust', 'Intake', 'Tuning', 'Turbo', 'Superchargers'],
  'Architectural': ['Channels', 'Window Frames', 'Door Sections', 'Structural Profiles'],
  'Industrial': ['Heat Sinks', 'Machine Parts', 'Structural Components', 'Custom Extrusions'],
  'Transportation': ['Automotive Parts', 'Railway Components', 'Marine Profiles'],
  'Custom': ['Custom Profiles', 'Special Designs', 'Bespoke Solutions']
};

const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'
];

// Helper function to sync products with frontend
const syncProductsWithFrontend = (products) => {
  try {
    // Format products for frontend compatibility
    const frontendProducts = products.map(product => ({
      _id: product._id || product.id,
      productName: product.name,
      category: product.category,
      sectionId: product.sectionId || `SKU-${Math.floor(Math.random() * 10000)}`,
      productPic: product.images && product.images.length > 0 ? product.images[0] : '',
      price: product.price,
      a: product.dimensions?.a || '',
      b: product.dimensions?.b || '',
      t: product.dimensions?.t || '',
      wtkgm: product.dimensions?.weight || '',
      dieAvailable: product.dieAvailable || false
    }));
    
    // Save to localStorage for frontend access
    localStorage.setItem('products', JSON.stringify(frontendProducts));
    console.log('Products synced with frontend:', frontendProducts.length);
  } catch (error) {
    console.error('Error syncing products with frontend:', error);
  }
};

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
    cityAvailability: [],
    sectionId: '',
    dimensions: {
      a: '',
      b: '',
      t: '',
      weight: ''
    },
    dieAvailable: false
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
        
        // Sync products with frontend
        syncProductsWithFrontend(response.data);
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
        cityAvailability: product.cityAvailability || [],
        dimensions: product.dimensions || { a: '', b: '', t: '', weight: '' },
        dieAvailable: product.dieAvailable || false
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
        cityAvailability: [],
        sectionId: `SKU-${Math.floor(Math.random() * 10000)}`,
        dimensions: {
          a: '',
          b: '',
          t: '',
          weight: ''
        },
        dieAvailable: false
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

  const handleDimensionChange = (field, value) => {
    setCurrentProduct({
      ...currentProduct,
      dimensions: {
        ...currentProduct.dimensions,
        [field]: value
      }
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
      let updatedProducts;
      
      if (isEditing) {
        // Update existing product
        const response = await productsAPI.updateProduct(currentProduct._id, currentProduct);
        updatedProducts = products.map(p => 
          p._id === currentProduct._id ? response.data : p
        );
        setProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Product updated successfully',
          severity: 'success'
        });
      } else {
        // Add new product
        const response = await productsAPI.createProduct(currentProduct);
        updatedProducts = [...products, response.data];
        setProducts(updatedProducts);
        setSnackbar({
          open: true,
          message: 'Product added successfully',
          severity: 'success'
        });
      }
      
      // Sync updated products with frontend
      syncProductsWithFrontend(updatedProducts);
      
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
      const updatedProducts = products.filter(p => p._id !== id);
      setProducts(updatedProducts);
      
      // Sync updated products with frontend
      syncProductsWithFrontend(updatedProducts);
      
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
                label="Section ID"
                name="sectionId"
                fullWidth
                value={currentProduct.sectionId}
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
              <FormControlLabel
                control={
                  <Switch
                    checked={currentProduct.dieAvailable}
                    onChange={handleChange}
                    name="dieAvailable"
                    color="primary"
                  />
                }
                label="Die Available"
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
                    label="Category"
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Category"
                    margin="dense"
                  />
                )}
                disabled={!currentProduct.category}
              />
              
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
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Dimensions</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="A"
                    fullWidth
                    value={currentProduct.dimensions.a}
                    onChange={(e) => handleDimensionChange('a', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="B"
                    fullWidth
                    value={currentProduct.dimensions.b}
                    onChange={(e) => handleDimensionChange('b', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="T"
                    fullWidth
                    value={currentProduct.dimensions.t}
                    onChange={(e) => handleDimensionChange('t', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Weight (KG/M)"
                    fullWidth
                    value={currentProduct.dimensions.weight}
                    onChange={(e) => handleDimensionChange('weight', e.target.value)}
                  />
                </Grid>
              </Grid>
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