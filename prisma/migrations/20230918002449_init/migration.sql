-- CreateTable
CREATE TABLE `planOrder` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planSection` (
    `id` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `planOrderId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `planSection` ADD CONSTRAINT `planSection_planOrderId_fkey` FOREIGN KEY (`planOrderId`) REFERENCES `planOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
