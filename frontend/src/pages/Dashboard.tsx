import { useQuery } from '@tanstack/react-query'
import { BookOpen, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { bookService } from '../services/bookService'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { token } = useAuthStore()
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => bookService.getStatistics(),
    enabled: !!token, // Solo ejecutar la query si hay token
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-primary-100">Bienvenido al Sistema de Gestión de Inventario de Libros</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card border-l-4 border-primary-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total de Libros</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.total || 0}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Disponibles</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.available || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">No Disponibles</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats?.unavailable || 0}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/books/new"
            className="btn-primary text-center"
          >
            Agregar Nuevo Libro
          </Link>
          <Link
            to="/books"
            className="btn-secondary text-center"
          >
            Ver Todos los Libros
          </Link>
        </div>
      </div>
    </div>
  )
}
