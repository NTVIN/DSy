import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { todoAPI, authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Todos() {
    const [todos, setTodos] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { username, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => { fetchTodos() }, [])

    const fetchTodos = async () => {
        try {
            const response = await todoAPI.getAll()
            setTodos(response.data)
        } catch (err) {
            setError('Failed to load todos.')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!title.trim()) return
        try {
            const response = await todoAPI.create({ title, description })
            setTodos([...todos, response.data])
            setTitle('')
            setDescription('')
        } catch (err) {
            setError('Failed to create todo.')
        }
    }

    const handleToggle = async (id) => {
        try {
            const response = await todoAPI.toggle(id)
            setTodos(todos.map(todo => todo.id === id ? response.data : todo))
        } catch (err) {
            setError('Failed to update todo.')
        }
    }

    const handleDelete = async (id) => {
        try {
            await todoAPI.delete(id)
            setTodos(todos.filter(todo => todo.id !== id))
        } catch (err) {
            setError('Failed to delete todo.')
        }
    }

    const handleLogout = async () => {
        try { await authAPI.logout() } catch (err) {}
        finally { logout(); navigate('/login') }
    }

    const completed = todos.filter(t => t.completed).length
    const pending = todos.filter(t => !t.completed).length

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-gray-400 text-lg">Loading todos...</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                             style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-800">TodoApp</span>
                    </div>

                    {/* RIGHT side */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">👋 {username}</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Centered Content */}
            <div className="flex-1 flex justify-center px-4 py-10">
                <div className="w-full max-w-2xl space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Total', value: todos.length, color: 'text-gray-800' },
                            { label: 'Completed', value: completed, color: 'text-green-600' },
                            { label: 'Pending', value: pending, color: 'text-orange-500' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                                <p className={`text-3xl font-bold ${color}`}>{value}</p>
                                <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Add Todo */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-800 mb-4">Add New Task</h2>
                        <form onSubmit={handleCreate} className="space-y-3">
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition bg-gray-50"
                            />
                            <input
                                type="text"
                                placeholder="Add a description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition bg-gray-50"
                            />
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition hover:opacity-90 hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                                + Add Task
                            </button>
                        </form>
                    </div>

                    {/* Todo List */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-800">
                                My Tasks
                                <span className="ml-2 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {todos.length}
                </span>
                            </h2>
                        </div>

                        {todos.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-4xl mb-3">📝</p>
                                <p className="text-gray-400 font-medium">No tasks yet</p>
                                <p className="text-gray-300 text-sm mt-1">Add a task above to get started</p>
                            </div>
                        ) : (
                            <ul>
                                {todos.map((todo, i) => (
                                    <li
                                        key={todo.id}
                                        className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group ${i !== todos.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <button
                                            onClick={() => handleToggle(todo.id)}
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                                                todo.completed ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-purple-400'
                                            }`}
                                        >
                                            {todo.completed && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold text-sm ${todo.completed ? 'line-through text-gray-300' : 'text-gray-800'}`}>
                                                {todo.title}
                                            </p>
                                            {todo.description && (
                                                <p className="text-xs text-gray-400 mt-0.5 truncate">{todo.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(todo.id)}
                                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Todos