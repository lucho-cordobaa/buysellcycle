import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateStockProductoDepositoDto {
  @IsInt()
  @IsNotEmpty()
  depositoId!: number;
  @IsInt()
  @IsNotEmpty()
  productoId!: number;
  @IsInt()
  @IsNotEmpty()
  stock!: number;
}
