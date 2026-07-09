import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized globally
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Avoid looping if the refresh endpoint itself fails
            if (originalRequest.url.includes('login/refresh/')) {
                return Promise.reject(error);
            }
            
            originalRequest._retry = true;
            try {
                // The browser will automatically attach the refresh_token cookie
                await api.post('users/login/refresh/');
                
                // If successful, the new access_token cookie is set automatically.
                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, just reject the promise. 
                // The AuthContext and ProtectedRoutes will handle redirection gracefully.
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
