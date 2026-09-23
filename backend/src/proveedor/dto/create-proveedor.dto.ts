import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  razonSocial!: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{8}-\d$/, {
    message: 'El CUIT debe tener el formato XX-XXXXXXXX-X',
  })
  cuit!: string;
}
