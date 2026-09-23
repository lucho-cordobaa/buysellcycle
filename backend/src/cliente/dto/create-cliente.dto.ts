import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @IsString()
  @IsNotEmpty()
  apellido!: string;
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,8}$/, { message: 'El DNI debe tener 7 u 8 dígitos' })
  dni!: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  provinciaId!: number;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  localidadId!: number;
}
