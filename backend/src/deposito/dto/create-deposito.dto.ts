import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateDepositoDto {
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
