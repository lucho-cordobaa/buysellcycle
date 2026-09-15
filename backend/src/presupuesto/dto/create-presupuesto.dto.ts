import {
  IsArray,
  IsInt,
  IsNotEmpty,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleItemDto } from './detalle-item.dto';

export class CreatePresupuestoDto {
  @IsInt()
  @IsNotEmpty()
  clienteId!: number;

  @IsInt()
  @IsNotEmpty()
  usuarioId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetalleItemDto)
  detalleItems!: DetalleItemDto[];
}
