import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { todoAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Todos() {
    const [todos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await todoAPI.getAll();
            setTodos(response.data);
        } catch (err) {
            setError('Failed to load todos');
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const response = await todoAPI.create(newTitle, newDescription);
            setTodos([...todos, response.data]);
            setNewTitle('');
            setNewDescription('');
        } catch (err) {
            setError('Failed to create todo');
        }
    };

    const handleToggle = async (id) => {
        try {
            const response = await todoAPI.toggleComplete(id);
            setTodos(todos.map(todo =>
                todo.id === id ? response.data : todo
            ));
        } catch (err) {
            setError('Failed to update todo');
        }
    };

    const handleDelete = async (id) => {
        try {
            await todoAPI.delete(id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            setError('Failed to delete todo');
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            logout();
            navigate('/login');
        }
    };

    if (loading) {
        return <div className="loading">Loading todos...</div>;
    }

    return (
        <div className="todos-container">
            <div className="todos-header">
                <div>
                    <h2>My Todos</h2>
                    <p className="user-info">Welcome, {user?.username}!</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleCreate} className="todo-form">
                <div className="form-row">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Todo title"
                        className="todo-input"
                        required
                    />
                    <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="todo-input"
                    />
                    <button type="submit" className="add-btn">Add Todo</button>
                </div>
            </form>

            <div className="todos-list">
                {todos.length === 0 ? (
                    <p className="empty-message">No todos yet. Create one above!</p>
                ) : (
                    todos.map(todo => (
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <div className="todo-content">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggle(todo.id)}
                                />
                                <div className="todo-text">
                                    <h3>{todo.title}</h3>
                                    {todo.description && <p>{todo.description}</p>}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(todo.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Todos;