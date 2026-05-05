import axios from 'axios'

const api = axios.create({
    baseURL: '/api'
})

// Add token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken })
}

export const todoAPI = {
    getAll: () => api.get('/todos'),
    create: (data) => api.post('/todos', data),
    update: (id, data) => api.put(`/todos/${id}`, data),
    toggle: (id) => api.patch(`/todos/${id}/toggle`),
    delete: (id) => api.delete(`/todos/${id}`)
}

export default api