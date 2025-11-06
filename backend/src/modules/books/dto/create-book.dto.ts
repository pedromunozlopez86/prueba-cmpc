import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateBookDto {
  @ApiProperty({ description: "Book title", example: "Cien años de soledad" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: "Book author",
    example: "Gabriel García Márquez",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  @ApiProperty({
    description: "Book editorial",
    example: "Editorial Sudamericana",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  editorial: string;

  @ApiProperty({
    description: "Precio en pesos chilenos (CLP)",
    example: 15000,
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: "Book availability",
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @ApiProperty({ description: "Book genre", example: "Ficción" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genre: string;

  @ApiPropertyOptional({ description: "Book description" })
  @IsString()
  @IsOptional()
  description?: string;
}
