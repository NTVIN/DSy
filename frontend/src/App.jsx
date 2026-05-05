import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Todos from './components/Todos'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { token } = useAuth()

  return (
      <Router>
        <Routes>
          <Route
              path="/login"
              element={token ? <Navigate to="/todos" /> : <Login />}
          />
          <Route
              path="/register"
              element={token ? <Navigate to="/todos" /> : <Register />}
          />
          <Route
              path="/todos"
              element={
                <ProtectedRoute>
                  <Todos />
                </ProtectedRoute>
              }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
  )
}

export default App