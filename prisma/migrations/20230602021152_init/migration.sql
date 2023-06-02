/*
  Warnings:

  - You are about to drop the column `competitionId` on the `event` table. All the data in the column will be lost.
  - Added the required column `regattaId` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `event_competitionId_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `competitionId`,
    ADD COLUMN `regattaId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_regattaId_fkey` FOREIGN KEY (`regattaId`) REFERENCES `regatta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
