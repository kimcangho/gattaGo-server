/*
  Warnings:

  - You are about to drop the column `birthDate` on the `athlete` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `athlete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `athlete` DROP COLUMN `birthDate`,
    DROP COLUMN `phone`;
