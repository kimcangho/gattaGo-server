/*
  Warnings:

  - You are about to drop the column `eventDistance` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `eventLane` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `eventName` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `eventTime` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `notesBody` on the `notesPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `notesName` on the `notesPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `planSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `eventPlanSection` DROP COLUMN `eventDistance`,
    DROP COLUMN `eventLane`,
    DROP COLUMN `eventName`,
    DROP COLUMN `eventTime`,
    ADD COLUMN `distance` VARCHAR(191) NULL,
    ADD COLUMN `lane` INTEGER NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `startTime` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `notesPlanSection` DROP COLUMN `notesBody`,
    DROP COLUMN `notesName`,
    ADD COLUMN `body` MEDIUMTEXT NULL,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `planSection` DROP COLUMN `sectionId`;
