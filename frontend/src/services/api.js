import axios from 'axios'

const api = axios.create({
    baseURL: '/api'
})

// Add access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Automatically refresh token if access token expires (401 response)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('refreshToken')

            if (!refreshToken) {
                // No refresh token - force logout
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                // Try to get a new access token using the refresh token
                const response = await axios.post('/api/auth/refresh', { refreshToken })

                const newToken = response.data.token
                const newRefreshToken = response.data.refreshToken

                // Save new tokens
                localStorage.setItem('token', newToken)
                localStorage.setItem('refreshToken', newRefreshToken)

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return api(originalRequest)

            } catch (refreshError) {
                // Refresh token also expired - force logout
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

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