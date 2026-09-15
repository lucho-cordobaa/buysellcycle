import { IsInt, IsNotEmpty } from 'class-validator';

export class IngresoStockDto {
  @IsInt()
  @IsNotEmpty()
  depositoId!: number;
  @IsInt()
  @IsNotEmpty()
  productoId!: number;
  @IsInt()
  @IsNotEmpty()
  cantidad!: number;
}
