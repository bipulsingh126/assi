// API base URL
const API_URL = 'http://localhost:5001/api';

// Helper functions for localStorage
const getLocalStorageProducts = () => {
    try {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    } catch (error) {
        console.error('Error reading products from localStorage:', error);
        return [];
    }
};

const saveLocalStorageProducts = (products) => {
    try {
        localStorage.setItem('products', JSON.stringify(products));
    } catch (error) {
        console.error('Error saving products to localStorage:', error);
    }
};

// Helper function to get auth token
const getToken = () => localStorage.getItem('authToken');

// Helper function for API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        // Handle no response or network error
        if (!response) {
            throw new Error('Network error - no response received');
        }

        const responseData = await response.json();

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                // Clear invalid token
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');

                // If not a login/register request, redirect to login
                if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
                    window.location.href = '/login';
                }
            }

            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    register: (userData) => apiRequest('/auth/register', 'POST', userData),
    login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
    getMe: () => apiRequest('/auth/me'),
};

// Products API with localStorage fallback
export const productsAPI = {
    getProducts: async () => {
        try {
            const response = await apiRequest('/products');
            // Save products to localStorage for offline use
            saveLocalStorageProducts(response.data);
            return response;
        } catch (error) {
            // Return products from localStorage if API call fails
            const localProducts = getLocalStorageProducts();
            return { data: localProducts };
        }
    },

    getProduct: async (id) => {
        try {
            const response = await apiRequest(`/products/${id}`);
            return response;
        } catch (error) {
            // Try to find product in localStorage
            const localProducts = getLocalStorageProducts();
            const product = localProducts.find(p => p._id === id || p.id === id);

            if (product) {
                return { data: product };
            }
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            // Generate a temporary ID for new product
            const newProduct = {
                ...productData,
                _id: `temp_${Date.now()}`,
                createdAt: new Date().toISOString()
            };

            try {
                const response = await apiRequest('/products', 'POST', productData);
                // Update localStorage with the new product
                const localProducts = getLocalStorageProducts();
                saveLocalStorageProducts([...localProducts, response.data]);
                return response;
            } catch (error) {
                // Save to localStorage if API call fails
                const localProducts = getLocalStorageProducts();
                saveLocalStorageProducts([...localProducts, newProduct]);
                return { data: newProduct };
            }
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const response = await apiRequest(`/products/${id}`, 'PUT', productData);
            // Update product in localStorage
            const localProducts = getLocalStorageProducts();
            const updatedProducts = localProducts.map(p =>
                (p._id === id || p.id === id) ? response.data : p
            );
            saveLocalStorageProducts(updatedProducts);
            return response;
        } catch (error) {
            // Update in localStorage if API call fails
            const localProducts = getLocalStorageProducts();
            const updatedProduct = { ...productData, updatedAt: new Date().toISOString() };
            const updatedProducts = localProducts.map(p =>
                (p._id === id || p.id === id) ? updatedProduct : p
            );
            saveLocalStorageProducts(updatedProducts);
            return { data: updatedProduct };
        }
    },

    deleteProduct: async (id) => {
        try {
            const response = await apiRequest(`/products/${id}`, 'DELETE');
            // Remove from localStorage
            const localProducts = getLocalStorageProducts();
            saveLocalStorageProducts(localProducts.filter(p => p._id !== id && p.id !== id));
            return response;
        } catch (error) {
            // Remove from localStorage if API call fails
            const localProducts = getLocalStorageProducts();
            saveLocalStorageProducts(localProducts.filter(p => p._id !== id && p.id !== id));
            return { success: true };
        }
    }
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => apiRequest('/dashboard/stats'),
}; 