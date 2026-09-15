import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateSucursalDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsInt()
  @IsNotEmpty()
  provinciaId!: number;
  @IsInt()
  @IsNotEmpty()
  localidadId!: number;
}
