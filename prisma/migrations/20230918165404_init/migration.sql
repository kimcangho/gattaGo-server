/*
  Warnings:

  - Added the required column `sectionId` to the `planSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `planSection` ADD COLUMN `sectionId` VARCHAR(191) NOT NULL;
