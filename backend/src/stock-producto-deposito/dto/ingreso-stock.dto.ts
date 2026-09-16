import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class IngresoStockDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  depositoId!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  productoId!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  cantidad!: number;
}
