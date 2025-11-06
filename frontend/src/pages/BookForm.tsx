import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Upload } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { bookService } from '../services/bookService'

const bookSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255, 'Máximo 255 caracteres'),
  author: z.string().min(1, 'El autor es requerido').max(255, 'Máximo 255 caracteres'),
  editorial: z.string().min(1, 'La editorial es requerida').max(255, 'Máximo 255 caracteres'),
  genre: z.string().min(1, 'El género es requerido').max(100, 'Máximo 100 caracteres'),
  price: z.number().int('El precio debe ser un número entero').min(0, 'El precio debe ser mayor a 0').or(z.string().transform(val => parseInt(val, 10))),
  availability: z.boolean().optional(),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
})

type BookFormData = z.infer<typeof bookSchema>

export default function BookForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id

  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: book } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBook(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book ? {
      title: book.title,
      author: book.author,
      editorial: book.editorial,
      genre: book.genre,
      price: book.price,
      availability: book.availability,
      description: book.description || '',
    } : {
      availability: true,
    },
  })

  // Update form when book data is loaded
  if (book && isEditing) {
    setValue('title', book.title)
    setValue('author', book.author)
    setValue('editorial', book.editorial)
    setValue('genre', book.genre)
    setValue('price', book.price)
    setValue('availability', book.availability)
    setValue('description', book.description || '')
    if (book.imageUrl && !imagePreview) {
      setImagePreview(book.imageUrl)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: BookFormData) => {
    try {
      setIsLoading(true)
      
      let savedBook
      if (isEditing) {
        savedBook = await bookService.updateBook(id!, data)
        toast.success('Libro actualizado exitosamente')
      } else {
        savedBook = await bookService.createBook(data)
        toast.success('Libro creado exitosamente')
      }

      // Upload image if selected
      if (imageFile && savedBook.id) {
        await bookService.uploadImage(savedBook.id, imageFile)
        toast.success('Imagen subida exitosamente')
      }

      navigate('/books')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el libro')
    } finally {
      setIsLoading(false)
    }
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
      </div>

      {/* Form */}
      <div className="card max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Editar Libro' : 'Nuevo Libro'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                type="text"
                className="input"
                placeholder="Ej: Cien años de soledad"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor <span className="text-red-500">*</span>
              </label>
              <input
                {...register('author')}
                type="text"
                className="input"
                placeholder="Ej: Gabriel García Márquez"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
              )}
            </div>

            {/* Editorial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editorial <span className="text-red-500">*</span>
              </label>
              <input
                {...register('editorial')}
                type="text"
                className="input"
                placeholder="Ej: Editorial Sudamericana"
              />
              {errors.editorial && (
                <p className="mt-1 text-sm text-red-600">{errors.editorial.message}</p>
              )}
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género <span className="text-red-500">*</span>
              </label>
              <input
                {...register('genre')}
                type="text"
                className="input"
                placeholder="Ej: Ficción, Realismo Mágico"
              />
              {errors.genre && (
                <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (CLP) <span className="text-red-500">*</span>
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="1"
                min="0"
                className="input"
                placeholder="15000"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Availability */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('availability')}
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Disponible para préstamo
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Descripción del libro..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Libro
              </label>
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <div className="w-32 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click para subir</span> o arrastra una imagen
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/books"
              className="btn-secondary"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Libro' : 'Crear Libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
