import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';

export class CreateSucursalDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  provinciaId!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  localidadId!: number;
}
