/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `CategoriaNivel1` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `CategoriaNivel2` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Marca` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre,localidadId]` on the table `Sucursal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CategoriaNivel1_nombre_key` ON `CategoriaNivel1`(`nombre`);

-- CreateIndex
CREATE UNIQUE INDEX `CategoriaNivel2_nombre_key` ON `CategoriaNivel2`(`nombre`);

-- CreateIndex
CREATE UNIQUE INDEX `Marca_nombre_key` ON `Marca`(`nombre`);

-- CreateIndex
CREATE UNIQUE INDEX `Producto_nombre_key` ON `Producto`(`nombre`);

-- CreateIndex
CREATE UNIQUE INDEX `Sucursal_nombre_localidadId_key` ON `Sucursal`(`nombre`, `localidadId`);
