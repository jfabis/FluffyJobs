import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - dodaj token do ka¿dego ¿¹dania
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - obs³u¿ b³êdy autoryzacji
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing session');
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/users/register/', userData),
  refresh: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
  logout: (refreshToken) => api.post('/users/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('/users/profile/'),
};

export const jobsAPI = {
  getJobs: (params) => api.get('/jobs/', { params }),
  getJob: (id) => api.get('/jobs/' + id + '/'),
  createJob: (jobData) => api.post('/jobs/', jobData),
  updateJob: (id, jobData) => api.put('/jobs/' + id + '/', jobData),
  deleteJob: (id) => api.delete('/jobs/' + id + '/'),
  applyToJob: (id, applicationData) => api.post('/jobs/' + id + '/apply/', applicationData),
};

export const paymentsAPI = {
  getConfig: () => api.get('/payments/config/'),
  createCheckoutSession: (data) => api.post('/payments/create-checkout-session/', data),
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent/', data),
  confirmPayment: (data) => api.post('/payments/confirm-payment/', data),
  getTestCards: () => api.get('/payments/test-cards/'),
};

export const savedJobsAPI = {
  getSavedJobs: () => api.get('/jobs/saved/'),
  saveJob: (jobId) => api.post('/jobs/save/', { job_id: jobId }),
  unsaveJob: (jobId) => api.delete('/jobs/' + jobId + '/unsave/'),
  checkSavedJob: (jobId) => api.get('/jobs/' + jobId + '/check-saved/'),
};

export default api;
