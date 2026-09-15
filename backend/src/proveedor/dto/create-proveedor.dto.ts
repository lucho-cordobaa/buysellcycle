import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  razonSocial!: string;
  @IsString()
  @IsNotEmpty()
  cuit!: string;
}
