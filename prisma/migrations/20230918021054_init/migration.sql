/*
  Warnings:

  - Added the required column `order` to the `planSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `planSection` ADD COLUMN `order` INTEGER NOT NULL;
