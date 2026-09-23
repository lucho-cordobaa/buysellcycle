import { create } from 'zustand';
import { getProvincias } from '../entities/provincia/services/provincia';
import type { Provincia } from '../entities/provincia/types/provincia';

interface ProvinciaState {
  provincias: Provincia[];
  cargando: boolean;
  error: string | null;
  cargarProvincias: () => Promise<void>;
}

export const useProvinciaStore = create<ProvinciaState>((set) => ({
  provincias: [],
  cargando: false,
  error: null,
  cargarProvincias: async () => {
    set({ cargando: true, error: null });
    try {
      const provincias = await getProvincias();
      set({ provincias, cargando: false });
    } catch (error) {
      set({
        cargando: false,
        error:
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las provincias',
      });
      throw error;
    }
  },
}));
