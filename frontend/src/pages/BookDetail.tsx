import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { bookService } from '../services/bookService'

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBook(id!),
    enabled: !!id,
  })

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este libro?')) return

    try {
      await bookService.deleteBook(id!)
      toast.success('Libro eliminado exitosamente')
      navigate('/books')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar el libro')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Libro no encontrado</p>
        <Link to="/books" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Volver a la lista
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/books"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver a la lista
        </Link>
        <div className="flex gap-3">
          <Link
            to={`/books/${id}/edit`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Edit2 className="h-5 w-5" />
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 btn-danger"
          >
            <Trash2 className="h-5 w-5" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Book Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image */}
        <div className="lg:col-span-1">
          <div className="card">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-auto rounded-lg object-cover"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg flex items-center justify-center h-96">
                <span className="text-gray-400 text-lg">Sin imagen</span>
              </div>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {book.title}
              </h1>
              <span
                className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${
                  book.availability
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {book.availability ? 'Disponible' : 'No Disponible'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Autor</h3>
                <p className="text-lg text-gray-900">{book.author}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Editorial</h3>
                <p className="text-lg text-gray-900">{book.editorial}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Género</h3>
                <p className="text-lg text-gray-900">{book.genre}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Precio</h3>
                <p className="text-lg text-gray-900 font-semibold">
                  ${Number(book.price).toLocaleString('es-CL')}
                </p>
              </div>

              {book.description && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="md:col-span-2 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Creado:</span>
                    <p className="text-gray-900">
                      {new Date(book.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Actualizado:</span>
                    <p className="text-gray-900">
                      {new Date(book.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
