import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { StorageService } from "../storage/storage.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { FilterBookDto } from "./dto/filter-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./entities/book.entity";

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book,
    private storageService: StorageService
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      this.logger.log(`Creating book: ${createBookDto.title}`);
      const book = await this.bookModel.create(createBookDto as any);
      return book;
    } catch (error) {
      this.logger.error(`Error creating book: ${error.message}`);
      throw new InternalServerErrorException("Error creating book");
    }
  }

  async findAll(filterDto: FilterBookDto) {
    try {
      const {
        genre,
        editorial,
        author,
        availability,
        search,
        sortBy = "createdAt",
        sortOrder = "DESC",
        page = 1,
        limit = 10,
      } = filterDto;

      const where: any = {};

      // Apply filters
      if (genre) where.genre = genre;
      if (editorial) where.editorial = editorial;
      if (author) where.author = author;
      if (availability !== undefined) where.availability = availability;

      // Search across multiple fields
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { author: { [Op.iLike]: `%${search}%` } },
          { editorial: { [Op.iLike]: `%${search}%` } },
          { genre: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const offset = (page - 1) * limit;

      const { rows: books, count: total } =
        await this.bookModel.findAndCountAll({
          where,
          order: [[sortBy, sortOrder]],
          limit,
          offset,
        });

      return {
        data: books,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching books: ${error.message}`);
      throw new InternalServerErrorException("Error fetching books");
    }
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findByPk(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    try {
      const book = await this.findOne(id);
      this.logger.log(`Updating book: ${id}`);
      await book.update(updateBookDto);
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating book: ${error.message}`);
      throw new InternalServerErrorException("Error updating book");
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const book = await this.findOne(id);
      this.logger.log(`Soft deleting book: ${id}`);
      await book.destroy(); // Soft delete
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting book: ${error.message}`);
      throw new InternalServerErrorException("Error deleting book");
    }
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<Book> {
    try {
      const book = await this.findOne(id);

      // Eliminar imagen anterior si existe
      if (book.imageUrl) {
        await this.storageService.deleteFile(book.imageUrl);
      }

      // Subir nueva imagen a GCP Storage (modo MOCK)
      const imageUrl = await this.storageService.uploadFile(file);

      this.logger.log(`Image uploaded for book ${id}: ${imageUrl}`);

      await book.update({ imageUrl });
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error uploading image: ${error.message}`);
      throw new InternalServerErrorException("Error uploading image");
    }
  }

  async exportToCsv(): Promise<string> {
    try {
      const books = await this.bookModel.findAll();

      const header =
        "ID,Title,Author,Editorial,Price,Availability,Genre,Created At\n";
      const rows = books
        .map(
          (book) =>
            `${book.id},"${book.title}","${book.author}","${book.editorial}",${book.price},${book.availability},"${book.genre}",${book.createdAt}`
        )
        .join("\n");

      return header + rows;
    } catch (error) {
      this.logger.error(`Error exporting books to CSV: ${error.message}`);
      throw new InternalServerErrorException("Error exporting books");
    }
  }

  async getStatistics() {
    try {
      const total = await this.bookModel.count();
      const available = await this.bookModel.count({
        where: { availability: true },
      });
      const unavailable = await this.bookModel.count({
        where: { availability: false },
      });

      const byGenre = await this.bookModel.findAll({
        attributes: [
          "genre",
          [
            this.bookModel.sequelize.fn(
              "COUNT",
              this.bookModel.sequelize.col("id")
            ),
            "count",
          ],
        ],
        group: ["genre"],
      });

      return {
        total,
        available,
        unavailable,
        byGenre,
      };
    } catch (error) {
      this.logger.error(`Error getting statistics: ${error.message}`);
      throw new InternalServerErrorException("Error getting statistics");
    }
  }
}
