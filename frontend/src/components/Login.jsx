import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const testCredentials = [
        { label: 'Alice', email: 'alice@example.com', password: 'Alice123!' },
        { label: 'Bob', email: 'bob@example.com', password: 'Bob123!' },
        { label: 'Admin', email: 'admin@example.com', password: 'Admin123!' },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await authAPI.login({ email, password })
            login(response.data.token, {
                refreshToken: response.data.refreshToken,
                username: response.data.username,
                email: response.data.email
            })
            navigate('/todos')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo / Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">TodoApp</h1>
                    <p className="text-gray-400 mt-2">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="alice@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition bg-gray-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo accounts */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Demo accounts — click to fill</p>
                        <div className="grid grid-cols-3 gap-2">
                            {testCredentials.map((cred) => (
                                <button
                                    key={cred.label}
                                    type="button"
                                    onClick={() => { setEmail(cred.email); setPassword(cred.password); setError('') }}
                                    className="py-2.5 text-xs font-semibold text-purple-600 border-2 border-purple-100 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition"
                                >
                                    {cred.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')} className="text-purple-600 font-semibold cursor-pointer hover:underline">
            Register
          </span>
                </p>
            </div>
        </div>
    )
}

export default Login