import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { StorageModule } from "../storage/storage.module";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { Book } from "./entities/book.entity";

@Module({
  imports: [SequelizeModule.forFeature([Book]), StorageModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
