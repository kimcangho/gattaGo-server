/*
  Warnings:

  - You are about to drop the column `name` on the `regattaPlanSection` table. All the data in the column will be lost.
  - Added the required column `regattaName` to the `regattaPlanSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `regattaPlanSection` DROP COLUMN `name`,
    ADD COLUMN `regattaName` VARCHAR(191) NOT NULL;
