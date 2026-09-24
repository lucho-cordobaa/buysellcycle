import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export async function validarLocalidadDeProvincia(
  prisma: PrismaService,
  provinciaId: number,
  localidadId: number,
): Promise<void> {
  const localidad = await prisma.localidad.findFirst({
    where: { id: localidadId, provinciaId },
    select: { id: true },
  });

  if (!localidad) {
    throw new BadRequestException(
      'La localidad indicada no pertenece a la provincia seleccionada',
    );
  }
}
