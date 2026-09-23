import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { Rol } from '../../../generated/prisma/enums';

export class CreateUsuarioDto {
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
  @IsEnum(Rol)
  rol!: Rol;
  @IsString()
  @IsNotEmpty()
  nombreUsuario!: string;
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  sucursalId!: number;
}
