import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoriaNivel1Dto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
}
