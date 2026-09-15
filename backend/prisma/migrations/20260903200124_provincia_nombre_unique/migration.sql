/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Provincia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Provincia_nombre_key` ON `Provincia`(`nombre`);
