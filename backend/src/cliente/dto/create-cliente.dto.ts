import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsString()
  @IsNotEmpty()
  apellido!: string;
  @IsString()
  @IsNotEmpty()
  dni!: string;
  @IsString()
  @IsNotEmpty()
  email!: string;
  @IsInt()
  @IsNotEmpty()
  provinciaId!: number;
  @IsInt()
  @IsNotEmpty()
  localidadId!: number;
}
