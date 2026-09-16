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
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  cantidad!: number;
}
