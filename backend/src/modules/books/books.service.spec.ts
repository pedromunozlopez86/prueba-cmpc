import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

describe('BooksService', () => {
  let service: BooksService;
  let bookModel: any;

  const mockBook = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Book',
    author: 'Test Author',
    editorial: 'Test Editorial',
    price: 10000,
    availability: true,
    genre: 'Ficción',
    createdAt: new Date(),
    updatedAt: new Date(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockBookModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    sequelize: {
      fn: jest.fn(),
      col: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookModel = module.get(getModelToken(Book));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        editorial: 'Test Editorial',
        price: 10000,
        availability: true,
        genre: 'Ficción',
      };

      mockBookModel.create.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(result).toEqual(mockBook);
      expect(mockBookModel.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const filterDto = {
        page: 1,
        limit: 10,
      };

      mockBookModel.findAndCountAll.mockResolvedValue({
        rows: [mockBook],
        count: 1,
      });

      const result = await service.findAll(filterDto);

      expect(result).toEqual({
        data: [mockBook],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should filter by genre', async () => {
      const filterDto = {
        genre: 'Ficción',
        page: 1,
        limit: 10,
      };

      mockBookModel.findAndCountAll.mockResolvedValue({
        rows: [mockBook],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockBookModel.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBookModel.findByPk.mockResolvedValue(mockBook);

      const result = await service.findOne(mockBook.id);

      expect(result).toEqual(mockBook);
      expect(mockBookModel.findByPk).toHaveBeenCalledWith(mockBook.id);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto = {
        title: 'Updated Title',
      };

      mockBookModel.findByPk.mockResolvedValue(mockBook);
      mockBook.update.mockResolvedValue({ ...mockBook, ...updateBookDto });

      const result = await service.update(mockBook.id, updateBookDto);

      expect(mockBook.update).toHaveBeenCalledWith(updateBookDto);
    });
  });

  describe('remove', () => {
    it('should soft delete a book', async () => {
      mockBookModel.findByPk.mockResolvedValue(mockBook);

      await service.remove(mockBook.id);

      expect(mockBook.destroy).toHaveBeenCalled();
    });
  });

  describe('exportToCsv', () => {
    it('should export books to CSV format', async () => {
      mockBookModel.findAll.mockResolvedValue([mockBook]);

      const result = await service.exportToCsv();

      expect(result).toContain('ID,Title,Author');
      expect(result).toContain('Test Book');
    });
  });

  describe('getStatistics', () => {
    it('should return book statistics', async () => {
      mockBookModel.count.mockResolvedValue(10);
      mockBookModel.findAll.mockResolvedValue([
        { genre: 'Ficción', count: 5 },
      ]);

      const result = await service.getStatistics();

      expect(result.total).toBe(10);
      expect(mockBookModel.count).toHaveBeenCalled();
    });
  });
});
