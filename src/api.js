import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL+"/api",
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API methods
export const orderAPI = {
  // Submit a new order
  submitOrder: async (orderData) => {
    return apiClient.post('/place-order', orderData);
  },
  
  // Get all orders
  getOrders: async (data) => {
    return apiClient.post('/orders', data);
  },
  
  cancelOrder: async (data) => {
    return apiClient.patch('/order/cancel', data);
  },
  completeOrder: async (data) => {
    return apiClient.patch('/order/complete', data);
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    return apiClient.get(`/orders/${orderId}`);
  },
  
  // Update order status
  updateOrderStatus: async (orderId, status) => {
    return apiClient.patch(`/orders/${orderId}`, { status });
  },

  getMenu: async (data) => {
    return apiClient.post('/menus', data);
  },

  getMenuItems: async () => {
    return apiClient.get('/menu/items');
  },

  getAllQrcodes: async (data) =>{
    return apiClient.post('/get-all-qr-codes',data)
  },
  generateQrcode: async (data) =>{
    return apiClient.post("/qrcode",data)
  },
  registerPushNotificationDevice: async (data) =>{
    return apiClient.post('/v1/firebase/register-device',data)
  }
};

export default apiClient; 