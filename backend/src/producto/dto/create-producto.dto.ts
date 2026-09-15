import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsNumber()
  @IsNotEmpty()
  costoNeto!: number;
  @IsNumber()
  @IsNotEmpty()
  utilidad!: number;
  @IsNumber()
  @IsNotEmpty()
  descuentoContado!: number;
  @IsInt()
  @IsNotEmpty()
  marcaId!: number;
  @IsInt()
  @IsNotEmpty()
  categoriaNivel2Id!: number;
}
