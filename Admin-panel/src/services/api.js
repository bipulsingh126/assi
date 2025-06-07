// API base URL
const API_URL = 'http://localhost:5001/api';

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

// Products API
export const productsAPI = {
    getProducts: () => apiRequest('/products'),
    getProduct: (id) => apiRequest(`/products/${id}`),
    createProduct: (productData) => apiRequest('/products', 'POST', productData),
    updateProduct: (id, productData) => apiRequest(`/products/${id}`, 'PUT', productData),
    deleteProduct: (id) => apiRequest(`/products/${id}`, 'DELETE'),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => apiRequest('/dashboard/stats'),
}; 