import { IsInt, IsNotEmpty } from 'class-validator';

export class TransferenciaStockDto {
  @IsInt()
  @IsNotEmpty()
  depositoOrigenId!: number;
  @IsInt()
  @IsNotEmpty()
  depositoDestinoId!: number;
  @IsInt()
  @IsNotEmpty()
  productoId!: number;
  @IsInt()
  @IsNotEmpty()
  cantidad!: number;
}
