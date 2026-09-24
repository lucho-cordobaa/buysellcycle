# BuySellCycle — Frontend

Aplicación web de BuySellCycle, construida con React, TypeScript, Vite y Ant Design. Permite administrar el catálogo, los clientes y proveedores, las sucursales, los depósitos, el stock y los presupuestos mediante la API del backend.

## Instalación y ejecución

Desde esta carpeta (`frontend`), instalá las dependencias y levantá el servidor de desarrollo:

```bash
npm install
npm run dev
```

Vite muestra en la terminal la dirección local; por defecto es `http://localhost:5173`.

El cliente HTTP está configurado en `src/app/api/axios.ts` y apunta a `http://localhost:3000`. Si el backend corre en otra dirección, actualizá allí `baseURL` para que coincida. El backend también debe permitir el origen del frontend mediante CORS.

## Funcionalidades

- **Catálogo:** marcas, categorías y productos.
- **Comercial:** clientes, proveedores y presupuestos.
- **Operaciones:** sucursales, depósitos, usuarios y stock por depósito.

La página inicial redirige a `/marcas`. Las rutas principales son `/marcas`, `/categorias-nivel1`, `/categorias-nivel2`, `/productos`, `/clientes`, `/proveedores`, `/presupuestos`, `/sucursales`, `/depositos`, `/usuarios` y `/stock`.

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo con Vite
npm run build    # Verificar TypeScript y generar la compilación en dist/
npm run preview  # Previsualizar la compilación localmente
npm run lint     # Revisar el código con ESLint
```

## Estructura

```text
frontend/
├── public/           # Recursos estáticos
└── src/
    ├── app/api/      # Cliente HTTP de Axios
    ├── components/   # Componentes compartidos y layout
    ├── entities/     # Páginas, servicios y tipos por recurso
    ├── router/       # Rutas de la aplicación
    └── store/        # Estado compartido
```
