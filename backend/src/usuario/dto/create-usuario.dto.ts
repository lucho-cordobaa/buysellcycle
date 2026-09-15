import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
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
  dni!: string;
  @IsEnum(Rol)
  rol!: Rol;
  @IsString()
  @IsNotEmpty()
  nombreUsuario!: string;
  @IsInt()
  @IsNotEmpty()
  sucursalId!: number;
}
