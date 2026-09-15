import type { CategoriaNivel2 } from '../../categoria-nivel2/types/categoria-nivel2';

export interface CategoriaNivel1 {
  id: number;
  nombre: string;
  archivado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  categoriasNivel2: CategoriaNivel2[];
}
