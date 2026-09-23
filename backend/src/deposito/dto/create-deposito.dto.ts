import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDepositoDto {
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
