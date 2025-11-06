import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Index,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "books",
  timestamps: true,
  paranoid: true, // Soft delete
})
export class Book extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  author: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  editorial: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: "Precio en pesos chilenos (CLP) - sin decimales",
  })
  price: number;

  @Index
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  availability: boolean;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  genre: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
  })
  deletedAt: Date;
}
