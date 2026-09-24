import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class TransferenciaStockDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  depositoOrigenId!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  depositoDestinoId!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  productoId!: number;
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  cantidad!: number;
}
