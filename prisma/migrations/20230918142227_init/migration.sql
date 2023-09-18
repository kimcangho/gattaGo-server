/*
  Warnings:

  - You are about to drop the column `distance` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `lane` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `eventPlanSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `eventPlanSection` DROP COLUMN `distance`,
    DROP COLUMN `lane`,
    DROP COLUMN `name`,
    DROP COLUMN `startTime`,
    ADD COLUMN `eventDistance` VARCHAR(191) NULL,
    ADD COLUMN `eventLane` VARCHAR(191) NULL,
    ADD COLUMN `eventName` VARCHAR(191) NULL,
    ADD COLUMN `eventTime` DATETIME(3) NULL;
