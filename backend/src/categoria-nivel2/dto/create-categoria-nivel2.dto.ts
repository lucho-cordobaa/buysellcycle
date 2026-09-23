import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';

export class CreateCategoriaNivel2Dto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  categoriaNivel1Id!: number;
}
