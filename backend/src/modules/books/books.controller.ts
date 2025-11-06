import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { FilterBookDto } from "./dto/filter-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@ApiTags("books")
@Controller("books")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: "Create a new book" })
  @ApiResponse({ status: 201, description: "Book created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all books with filters and pagination" })
  @ApiResponse({ status: 200, description: "Books retrieved successfully" })
  async findAll(@Query() filterDto: FilterBookDto) {
    return this.booksService.findAll(filterDto);
  }

  @Get("export/csv")
  @ApiOperation({ summary: "Export books to CSV" })
  @ApiResponse({ status: 200, description: "CSV file generated" })
  async exportCsv(@Res() res: Response) {
    const csv = await this.booksService.exportToCsv();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=books.csv");
    res.status(HttpStatus.OK).send(csv);
  }

  @Get("statistics")
  @ApiOperation({ summary: "Get book statistics" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStatistics() {
    return this.booksService.getStatistics();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a book by ID" })
  @ApiResponse({ status: 200, description: "Book found" })
  @ApiResponse({ status: 404, description: "Book not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a book" })
  @ApiResponse({ status: 200, description: "Book updated successfully" })
  @ApiResponse({ status: 404, description: "Book not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a book (soft delete)" })
  @ApiResponse({ status: 200, description: "Book deleted successfully" })
  @ApiResponse({ status: 404, description: "Book not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.booksService.remove(id);
    return { message: "Book deleted successfully" };
  }

  @Post(":id/image")
  @ApiOperation({ summary: "Upload book image to GCP Storage (Mock Mode)" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  async uploadImage(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.booksService.uploadImage(id, file);
  }
}
