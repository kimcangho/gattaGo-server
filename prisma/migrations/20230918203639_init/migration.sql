/*
  Warnings:

  - You are about to drop the column `body` on the `notesPlanSection` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `notesPlanSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `notesPlanSection` DROP COLUMN `body`,
    DROP COLUMN `name`,
    ADD COLUMN `notesBody` MEDIUMTEXT NULL,
    ADD COLUMN `notesName` VARCHAR(191) NULL;
