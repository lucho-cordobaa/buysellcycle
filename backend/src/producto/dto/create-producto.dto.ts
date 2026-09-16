import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  costoNeto!: number;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  utilidad!: number;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  descuentoContado!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  marcaId!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  categoriaNivel2Id!: number;
}
