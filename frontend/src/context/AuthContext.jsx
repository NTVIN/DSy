import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'))
    const [username, setUsername] = useState(localStorage.getItem('username'))
    const [email, setEmail] = useState(localStorage.getItem('email'))

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken)
        localStorage.setItem('refreshToken', userData.refreshToken)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('email', userData.email)
        setToken(newToken)
        setRefreshToken(userData.refreshToken)
        setUsername(userData.username)
        setEmail(userData.email)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        setToken(null)
        setRefreshToken(null)
        setUsername(null)
        setEmail(null)
    }

    return (
        <AuthContext.Provider value={{ token, refreshToken, username, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}