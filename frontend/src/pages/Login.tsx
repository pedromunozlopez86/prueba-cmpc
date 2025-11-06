import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      console.log('Attempting login...'); // Debug
      const response = await authService.login(data)
      console.log('Login successful, response:', response); // Debug
      setAuth(response.user, response.access_token)
      console.log('Auth set, navigating...'); // Debug
      toast.success('¡Bienvenido!')
      // Pequeña espera para asegurar que el token se guarde en localStorage
      await new Promise(resolve => setTimeout(resolve, 100))
      navigate('/')
    } catch (error: any) {
      console.error('Login error:', error); // Debug
      toast.error(error.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <BookOpen className="h-16 w-16 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          CMPC Libros
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sistema de Gestión de Inventario
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="input"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              {...register('password')}
              type="password"
              className="input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
