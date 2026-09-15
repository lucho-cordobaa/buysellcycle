import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCategoriaNivel2Dto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsInt()
  @IsNotEmpty()
  categoriaNivel1Id!: number;
}
