import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    register: (username, email, password) =>
        api.post('/auth/register', { username, email, password }),

    logout: () =>
        api.post('/auth/logout'),
};

// Todo API
export const todoAPI = {
    getAll: () =>
        api.get('/todos'),

    create: (title, description) =>
        api.post('/todos', { title, description }),

    update: (id, title, description) =>
        api.put(`/todos/${id}`, { title, description }),

    toggleComplete: (id) =>
        api.patch(`/todos/${id}/toggle`),

    delete: (id) =>
        api.delete(`/todos/${id}`),
};

export default api;