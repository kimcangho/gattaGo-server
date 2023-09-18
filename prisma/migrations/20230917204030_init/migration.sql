/*
  Warnings:

  - You are about to drop the column `order` on the `eventPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `notesPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `regattaPlanSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `eventPlanSection` DROP COLUMN `order`;

-- AlterTable
ALTER TABLE `notesPlanSection` DROP COLUMN `order`;

-- AlterTable
ALTER TABLE `regattaPlanSection` DROP COLUMN `order`;
