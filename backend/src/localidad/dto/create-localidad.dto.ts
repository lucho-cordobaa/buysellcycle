import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateLocalidadDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  provinciaId!: number;
}
