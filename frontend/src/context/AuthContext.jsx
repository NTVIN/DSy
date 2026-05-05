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
    const [username, setUsername] = useState(localStorage.getItem('username'))
    const [email, setEmail] = useState(localStorage.getItem('email'))

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('email', userData.email)
        setToken(newToken)
        setUsername(userData.username)
        setEmail(userData.email)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        setToken(null)
        setUsername(null)
        setEmail(null)
    }

    return (
        <AuthContext.Provider value={{ token, username, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}