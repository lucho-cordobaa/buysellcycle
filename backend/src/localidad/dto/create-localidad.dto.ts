import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLocalidadDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsInt()
  @IsNotEmpty()
  provinciaId!: number;
}
