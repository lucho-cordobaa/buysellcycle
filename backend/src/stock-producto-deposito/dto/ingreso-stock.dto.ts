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
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  cantidad!: number;
}
