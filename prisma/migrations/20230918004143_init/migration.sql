/*
  Warnings:

  - You are about to drop the column `planOrderId` on the `planSection` table. All the data in the column will be lost.
  - You are about to drop the column `planOrderId` on the `racePlan` table. All the data in the column will be lost.
  - You are about to drop the `planOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `planSection` DROP FOREIGN KEY `planSection_planOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `racePlan` DROP FOREIGN KEY `racePlan_planOrderId_fkey`;

-- AlterTable
ALTER TABLE `planSection` DROP COLUMN `planOrderId`,
    ADD COLUMN `racePlanId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `racePlan` DROP COLUMN `planOrderId`;

-- DropTable
DROP TABLE `planOrder`;

-- AddForeignKey
ALTER TABLE `planSection` ADD CONSTRAINT `planSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
