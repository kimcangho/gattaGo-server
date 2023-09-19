/*
  Warnings:

  - You are about to drop the column `address` on the `regattaPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `regattaPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `regattaPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `regattaPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `regattaPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `regattaPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `regattaPlanSection` table. All the data in the column will be lost.
  - Added the required column `regattaName` to the `regattaPlanSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `regattaPlanSection` DROP COLUMN `address`,
    DROP COLUMN `contact`,
    DROP COLUMN `email`,
    DROP COLUMN `endDate`,
    DROP COLUMN `name`,
    DROP COLUMN `phone`,
    DROP COLUMN `startDate`,
    ADD COLUMN `regattaAddress` VARCHAR(191) NULL,
    ADD COLUMN `regattaContact` VARCHAR(191) NULL,
    ADD COLUMN `regattaEmail` VARCHAR(191) NULL,
    ADD COLUMN `regattaEndDate` DATETIME(3) NULL,
    ADD COLUMN `regattaName` VARCHAR(191) NOT NULL,
    ADD COLUMN `regattaPhone` VARCHAR(191) NULL,
    ADD COLUMN `regattaStartDate` DATETIME(3) NULL;
