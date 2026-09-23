import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetalleItemDto } from './detalle-item.dto';

export class CreatePresupuestoDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  clienteId!: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  usuarioId!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetalleItemDto)
  detalleItems!: DetalleItemDto[];
}
