import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Book',
    author: 'Test Author',
    editorial: 'Test Editorial',
    price: 10000,
    availability: true,
    genre: 'Ficción',
  };

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadImage: jest.fn(),
    exportToCsv: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const filterDto = {
        page: 1,
        limit: 10,
      };

      const expectedResult = {
        data: [mockBook],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockBooksService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(mockBook.id);

      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith(mockBook.id);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto = {
        title: 'Updated Title',
      };

      const updatedBook = { ...mockBook, ...updateBookDto };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(mockBook.id, updateBookDto);

      expect(result).toEqual(updatedBook);
      expect(service.update).toHaveBeenCalledWith(mockBook.id, updateBookDto);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockBook.id);

      expect(result).toEqual({ message: 'Book deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(mockBook.id);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics', async () => {
      const stats = {
        total: 10,
        available: 8,
        unavailable: 2,
        byGenre: [],
      };

      mockBooksService.getStatistics.mockResolvedValue(stats);

      const result = await controller.getStatistics();

      expect(result).toEqual(stats);
    });
  });
});
