/*
  Warnings:

  - You are about to drop the `racePlans` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `order` to the `eventPlanSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `notesPlanSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `regattaPlanSection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `eventPlanSection` DROP FOREIGN KEY `eventPlanSection_racePlanId_fkey`;

-- DropForeignKey
ALTER TABLE `notesPlanSection` DROP FOREIGN KEY `notesPlanSection_racePlanId_fkey`;

-- DropForeignKey
ALTER TABLE `racePlans` DROP FOREIGN KEY `racePlans_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `regattaPlanSection` DROP FOREIGN KEY `regattaPlanSection_racePlanId_fkey`;

-- AlterTable
ALTER TABLE `eventPlanSection` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `notesPlanSection` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `regattaPlanSection` ADD COLUMN `order` INTEGER NOT NULL;

-- DropTable
DROP TABLE `racePlans`;

-- CreateTable
CREATE TABLE `racePlan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `racePlan` ADD CONSTRAINT `racePlan_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `regattaPlanSection` ADD CONSTRAINT `regattaPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventPlanSection` ADD CONSTRAINT `eventPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notesPlanSection` ADD CONSTRAINT `notesPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
