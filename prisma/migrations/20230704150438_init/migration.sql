/*
  Warnings:

  - You are about to drop the `paddlerStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `paddlerStats` DROP FOREIGN KEY `paddlerStats_athleteId_fkey`;

-- DropTable
DROP TABLE `paddlerStats`;

-- CreateTable
CREATE TABLE `paddlerSkills` (
    `id` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,
    `isSteers` BOOLEAN NOT NULL,
    `isDrummer` BOOLEAN NOT NULL,
    `isStroker` BOOLEAN NOT NULL,
    `isCaller` BOOLEAN NOT NULL,
    `isBailer` BOOLEAN NOT NULL,
    `is200m` BOOLEAN NOT NULL,
    `is500m` BOOLEAN NOT NULL,
    `is1000m` BOOLEAN NOT NULL,
    `is2000m` BOOLEAN NOT NULL,
    `isVeteran` BOOLEAN NOT NULL,
    `isSteadyTempo` BOOLEAN NOT NULL,
    `isVocal` BOOLEAN NOT NULL,
    `isTechnicallyProficient` BOOLEAN NOT NULL,
    `isLeader` BOOLEAN NOT NULL,
    `isNewbie` BOOLEAN NOT NULL,
    `isRushing` BOOLEAN NOT NULL,
    `isLagging` BOOLEAN NOT NULL,
    `isTechnicallyPoor` BOOLEAN NOT NULL,
    `isInjuryProne` BOOLEAN NOT NULL,
    `isLoadManaged` BOOLEAN NOT NULL,
    `isPacer` BOOLEAN NOT NULL,
    `isEngine` BOOLEAN NOT NULL,
    `isRocket` BOOLEAN NOT NULL,

    UNIQUE INDEX `paddlerSkills_athleteId_key`(`athleteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `paddlerSkills` ADD CONSTRAINT `paddlerSkills_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
