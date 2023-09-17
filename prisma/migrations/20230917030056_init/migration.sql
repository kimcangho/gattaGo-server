/*
  Warnings:

  - You are about to drop the `raceDayPlans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `raceDayPlans` DROP FOREIGN KEY `raceDayPlans_teamId_fkey`;

-- DropTable
DROP TABLE `raceDayPlans`;

-- CreateTable
CREATE TABLE `RacePlans` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RacePlans` ADD CONSTRAINT `RacePlans_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
