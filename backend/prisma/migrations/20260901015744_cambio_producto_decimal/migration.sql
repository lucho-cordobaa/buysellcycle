-- AlterTable
ALTER TABLE `producto` MODIFY `costoNeto` DECIMAL(10, 2) NOT NULL,
    MODIFY `utilidad` DECIMAL(10, 2) NOT NULL,
    MODIFY `precioLista` DECIMAL(10, 2) NOT NULL,
    MODIFY `descuentoContado` DECIMAL(10, 2) NOT NULL,
    MODIFY `precioContado` DECIMAL(10, 2) NOT NULL;
