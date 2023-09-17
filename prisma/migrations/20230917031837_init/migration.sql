/*
  Warnings:

  - You are about to drop the `RacePlans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `RacePlans` DROP FOREIGN KEY `RacePlans_teamId_fkey`;

-- DropTable
DROP TABLE `RacePlans`;

-- CreateTable
CREATE TABLE `racePlans` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regattaPlanSection` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `racePlansId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventPlanSection` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,
    `lane` INTEGER NOT NULL,
    `racePlansId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notesPlanSection` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `body` MEDIUMTEXT NOT NULL,
    `racePlansId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `racePlans` ADD CONSTRAINT `racePlans_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `regattaPlanSection` ADD CONSTRAINT `regattaPlanSection_racePlansId_fkey` FOREIGN KEY (`racePlansId`) REFERENCES `racePlans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventPlanSection` ADD CONSTRAINT `eventPlanSection_racePlansId_fkey` FOREIGN KEY (`racePlansId`) REFERENCES `racePlans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notesPlanSection` ADD CONSTRAINT `notesPlanSection_racePlansId_fkey` FOREIGN KEY (`racePlansId`) REFERENCES `racePlans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
