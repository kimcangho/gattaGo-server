/*
  Warnings:

  - You are about to drop the column `racePlansId` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `racePlansId` on the `notesPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `racePlansId` on the `regattaPlanSection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `eventPlanSection` DROP FOREIGN KEY `eventPlanSection_racePlansId_fkey`;

-- DropForeignKey
ALTER TABLE `notesPlanSection` DROP FOREIGN KEY `notesPlanSection_racePlansId_fkey`;

-- DropForeignKey
ALTER TABLE `regattaPlanSection` DROP FOREIGN KEY `regattaPlanSection_racePlansId_fkey`;

-- AlterTable
ALTER TABLE `eventPlanSection` DROP COLUMN `racePlansId`,
    ADD COLUMN `racePlanId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notesPlanSection` DROP COLUMN `racePlansId`,
    ADD COLUMN `racePlanId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `regattaPlanSection` DROP COLUMN `racePlansId`,
    ADD COLUMN `racePlanId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `regattaPlanSection` ADD CONSTRAINT `regattaPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventPlanSection` ADD CONSTRAINT `eventPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notesPlanSection` ADD CONSTRAINT `notesPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
