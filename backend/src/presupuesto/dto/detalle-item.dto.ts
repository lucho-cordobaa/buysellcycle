import { IsInt, IsNotEmpty } from 'class-validator';

export class DetalleItemDto {
  @IsInt()
  @IsNotEmpty()
  productoId!: number;

  @IsInt()
  @IsNotEmpty()
  cantidad!: number;
}
