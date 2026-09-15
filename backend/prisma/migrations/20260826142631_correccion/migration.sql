/*
  Warnings:

  - You are about to drop the column `fecha_actualizacion` on the `provincia` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `provincia` table. All the data in the column will be lost.
  - Added the required column `fechaActualizacion` to the `Provincia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `provincia` DROP COLUMN `fecha_actualizacion`,
    DROP COLUMN `fecha_creacion`,
    ADD COLUMN `fechaActualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Localidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `provinciaId` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Localidad` ADD CONSTRAINT `Localidad_provinciaId_fkey` FOREIGN KEY (`provinciaId`) REFERENCES `Provincia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
