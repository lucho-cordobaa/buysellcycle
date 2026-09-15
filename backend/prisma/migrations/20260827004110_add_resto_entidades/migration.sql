-- CreateTable
CREATE TABLE `Deposito` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `provinciaId` INTEGER NOT NULL,
    `localidadId` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Deposito_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proveedor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `razonSocial` VARCHAR(191) NOT NULL,
    `cuit` VARCHAR(191) NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Proveedor_cuit_key`(`cuit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `stockTotal` INTEGER NOT NULL,
    `costoNeto` DOUBLE NOT NULL,
    `utilidad` DOUBLE NOT NULL,
    `precioLista` DOUBLE NOT NULL,
    `descuentoContado` DOUBLE NOT NULL,
    `precioContado` DOUBLE NOT NULL,
    `estado` ENUM('DISPONIBLE', 'ACTIVO', 'INACTIVO') NOT NULL,
    `fechaHoraUltimoMovimientoStock` DATETIME(3) NOT NULL,
    `fechaHoraUltimaSincronizacionStock` DATETIME(3) NOT NULL,
    `rutaImagenStorage` VARCHAR(191) NOT NULL,
    `marcaId` INTEGER NOT NULL,
    `categoriaNivel2Id` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockProductoDeposito` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `depositoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `archivado` BOOLEAN NOT NULL DEFAULT false,
    `fechaCreacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaActualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StockProductoDeposito_depositoId_productoId_key`(`depositoId`, `productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Deposito` ADD CONSTRAINT `Deposito_provinciaId_fkey` FOREIGN KEY (`provinciaId`) REFERENCES `Provincia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deposito` ADD CONSTRAINT `Deposito_localidadId_fkey` FOREIGN KEY (`localidadId`) REFERENCES `Localidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `Marca`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_categoriaNivel2Id_fkey` FOREIGN KEY (`categoriaNivel2Id`) REFERENCES `CategoriaNivel2`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockProductoDeposito` ADD CONSTRAINT `StockProductoDeposito_depositoId_fkey` FOREIGN KEY (`depositoId`) REFERENCES `Deposito`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockProductoDeposito` ADD CONSTRAINT `StockProductoDeposito_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
