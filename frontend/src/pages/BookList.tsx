import { useQuery } from '@tanstack/react-query'
import { Download, Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { bookService } from '../services/bookService'
import { Book } from '../types/book'

export default function BookList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [editorial, setEditorial] = useState('')
  const [author, setAuthor] = useState('')
  const [available, setAvailable] = useState<boolean | ''>('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['books', page, search, genre, editorial, author, available],
    queryFn: () => bookService.getBooks({
      page,
      limit: 10,
      search,
      genre: genre || undefined,
      editorial: editorial || undefined,
      author: author || undefined,
      availability: available === '' ? undefined : available,
    }),
  })

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este libro?')) return

    try {
      await bookService.deleteBook(id)
      toast.success('Libro eliminado exitosamente')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar el libro')
    }
  }

  const handleExportCSV = async () => {
    try {
      const blob = await bookService.exportToCsv()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `libros-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('CSV descargado exitosamente')
    } catch (error: any) {
      toast.error('Error al exportar CSV')
    }
  }

  const resetFilters = () => {
    setSearch('')
    setGenre('')
    setEditorial('')
    setAuthor('')
    setAvailable('')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Libros</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Download className="h-5 w-5" />
            Exportar CSV
          </button>
          <Link
            to="/books/new"
            className="flex items-center gap-2 btn-primary"
          >
            <Plus className="h-5 w-5" />
            Nuevo Libro
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Búsqueda
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, autor, ISBN..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Género
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Ficción, Ciencia..."
              className="input"
            />
          </div>

          {/* Editorial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Editorial
            </label>
            <input
              type="text"
              value={editorial}
              onChange={(e) => setEditorial(e.target.value)}
              placeholder="Editorial..."
              className="input"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autor
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nombre del autor..."
              className="input"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilidad
            </label>
            <select
              value={available === '' ? '' : available ? 'true' : 'false'}
              onChange={(e) => setAvailable(e.target.value === '' ? '' : e.target.value === 'true')}
              className="input"
            >
              <option value="">Todos</option>
              <option value="true">Disponible</option>
              <option value="false">No Disponible</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando libros...</p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No se encontraron libros</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Género
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Editorial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disponibilidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.data.map((book: Book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{book.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{book.genre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{book.editorial}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">${Number(book.price).toLocaleString('es-CL')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.availability
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {book.availability ? 'Disponible' : 'No Disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/books/${book.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/books/${book.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit2 className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {data?.data.length || 0} de {data?.meta.total || 0} libros
                  (Página {page} de {data?.meta.totalPages || 1})
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= (data?.meta.totalPages || 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
