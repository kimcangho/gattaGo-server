/*
  Warnings:

  - You are about to drop the column `regattaName` on the `regattaPlanSection` table. All the data in the column will be lost.
  - Added the required column `name` to the `regattaPlanSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `regattaPlanSection` DROP COLUMN `regattaName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
