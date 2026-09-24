# BuySellCycle — Backend

API REST de BuySellCycle, desarrollada con NestJS, TypeScript, Prisma ORM y MySQL. La API administra el catálogo, las ubicaciones, el stock y los presupuestos.

## Configuración

Desde esta carpeta (`backend`), instalá las dependencias:

```bash
npm install
```

Creá un archivo `.env` en `backend` con la URL de conexión a MySQL:

```env
DATABASE_URL="mysql://USUARIO:CONTRASEÑA@localhost:3306/buysellcycle"
```

Reemplazá `USUARIO` y `CONTRASEÑA` por las credenciales de tu servidor. La base `buysellcycle` debe existir antes de ejecutar las migraciones.

## Base de datos

Generá el cliente de Prisma y aplicá las migraciones incluidas en el proyecto:

```bash
npx prisma generate
npx prisma migrate deploy
```

Para una base de desarrollo donde vayas a crear nuevas migraciones, podés usar:

```bash
npx prisma migrate dev
```

Para cargar las provincias y localidades iniciales:

```bash
npx prisma db seed
```

El seed usa `prisma/localidades.json` y omite registros duplicados. Podés volver a ejecutarlo si necesitás completar esos datos.

## Ejecutar la API

```bash
# Desarrollo con recarga automática
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar la compilación
npm run start:prod
```

Por defecto, la API escucha en `http://localhost:3000`. Para cambiar el puerto, definí `PORT` en el entorno:

```env
PORT=3000
```

La aplicación habilita CORS para `http://localhost:5173`, el origen predeterminado de Vite.

## Módulos de la API

Los controladores Nest exponen recursos para:

- Catálogo: marcas, categorías de nivel 1 y 2, y productos.
- Operaciones: depósitos, stock por depósito y transferencias de stock.
- Estructura y personas: provincias, localidades, sucursales, usuarios, clientes y proveedores.
- Ventas: presupuestos y sus detalles.

Los endpoints se organizan por recurso y están implementados en `src/<recurso>/<recurso>.controller.ts`. La API no incluye autenticación configurada actualmente.

## Comandos útiles

```bash
npm run lint       # Revisar y corregir estilo con ESLint
npm run test       # Pruebas unitarias
npm run test:e2e   # Pruebas end-to-end
npm run test:cov   # Cobertura de pruebas
```

## Estructura

```text
backend/
├── prisma/          # Esquema, migraciones y datos iniciales
├── src/             # Módulos, controladores y servicios NestJS
└── test/            # Configuración y pruebas end-to-end
```
