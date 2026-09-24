import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateStockProductoDepositoDto {
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
  @IsPositive({ message: 'El stock debe ser positivo' })
  stock!: number;
}
