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

    useEffect(() => {
        fetchTodos()
    }, [])

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
            setTodos(todos.map(todo =>
                todo.id === id ? response.data : todo
            ))
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
        try {
            await authAPI.logout()
        } catch (err) {
            // Logout anyway even if API call fails
        } finally {
            logout()
            navigate('/login')
        }
    }

    if (loading) return (
        <div className="todo-container">
            <p>Loading todos...</p>
        </div>
    )

    return (
        <div className="todo-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Hello, {username}! 👋</h2>
                <button
                    className="secondary-btn"
                    onClick={handleLogout}
                    style={{ width: 'auto', padding: '0.5rem 1rem' }}
                >
                    Logout
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            {/* Create Todo Form */}
            <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Todo title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit" className="primary-btn">
                    + Add Todo
                </button>
            </form>

            {/* Todo List */}
            {todos.length === 0 ? (
                <p>No todos yet. Create one above! 🎉</p>
            ) : (
                todos.map(todo => (
                    <div
                        key={todo.id}
                        className={`todo-item ${todo.completed ? 'completed' : ''}`}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggle(todo.id)}
                                style={{ width: 'auto', cursor: 'pointer' }}
                            />
                            <div>
                                <span style={{ fontWeight: '600' }}>{todo.title}</span>
                                {todo.description && (
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {todo.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            className="danger-btn"
                            onClick={() => handleDelete(todo.id)}
                            style={{ width: 'auto', padding: '0.5rem 1rem' }}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}

            {/* Stats */}
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length} | Pending: {todos.filter(t => !t.completed).length}</p>
            </div>
        </div>
    )
}

export default Todos