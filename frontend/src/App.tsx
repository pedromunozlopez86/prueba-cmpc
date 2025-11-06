import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'

import Login from './pages/Login'

import BookDetail from './pages/BookDetail'
import BookForm from './pages/BookForm'
import BookList from './pages/BookList'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import { useAuthStore } from './store/authStore'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token)
  return !token ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BookList />} />
          <Route path="books/new" element={<BookForm />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="books/:id/edit" element={<BookForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
