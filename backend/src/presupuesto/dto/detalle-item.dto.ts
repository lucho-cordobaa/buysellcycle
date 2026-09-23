import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class DetalleItemDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  productoId!: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  cantidad!: number;
}
