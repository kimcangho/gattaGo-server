/*
  Warnings:

  - You are about to drop the `Athlete` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AthletesInLineups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AthletesInTeams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lineup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamsInEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamsInRegattas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AthletesInLineups` DROP FOREIGN KEY `AthletesInLineups_athleteId_fkey`;

-- DropForeignKey
ALTER TABLE `AthletesInLineups` DROP FOREIGN KEY `AthletesInLineups_lineupId_fkey`;

-- DropForeignKey
ALTER TABLE `AthletesInTeams` DROP FOREIGN KEY `AthletesInTeams_athleteId_fkey`;

-- DropForeignKey
ALTER TABLE `AthletesInTeams` DROP FOREIGN KEY `AthletesInTeams_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `Event` DROP FOREIGN KEY `Event_competitionId_fkey`;

-- DropForeignKey
ALTER TABLE `Lineup` DROP FOREIGN KEY `Lineup_rosterId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamsInEvents` DROP FOREIGN KEY `TeamsInEvents_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamsInEvents` DROP FOREIGN KEY `TeamsInEvents_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamsInRegattas` DROP FOREIGN KEY `TeamsInRegattas_regattaId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamsInRegattas` DROP FOREIGN KEY `TeamsInRegattas_teamId_fkey`;

-- DropTable
DROP TABLE `Athlete`;

-- DropTable
DROP TABLE `AthletesInLineups`;

-- DropTable
DROP TABLE `AthletesInTeams`;

-- DropTable
DROP TABLE `Event`;

-- DropTable
DROP TABLE `Lineup`;

-- DropTable
DROP TABLE `Team`;

-- DropTable
DROP TABLE `TeamsInEvents`;

-- DropTable
DROP TABLE `TeamsInRegattas`;

-- CreateTable
CREATE TABLE `event` (
    `id` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(255) NOT NULL,
    `division` VARCHAR(255) NOT NULL,
    `level` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    `boatSize` VARCHAR(255) NOT NULL,
    `progressionType` VARCHAR(255) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `lanes` INTEGER NOT NULL,
    `entries` INTEGER NOT NULL,
    `isSeeded` BOOLEAN NOT NULL,
    `isCompleted` BOOLEAN NOT NULL,
    `competitionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `division` VARCHAR(255) NOT NULL,
    `level` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lineup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `rosterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `athlete` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    `paddleSide` VARCHAR(255) NOT NULL,
    `weight` INTEGER NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `notes` MEDIUMTEXT NOT NULL,
    `isAvailable` BOOLEAN NOT NULL,
    `isManager` BOOLEAN NOT NULL,

    UNIQUE INDEX `athlete_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paddlerStats` (
    `id` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,
    `paddledSince` DATETIME(3) NOT NULL,
    `isDrummer` BOOLEAN NOT NULL,
    `isSteers` BOOLEAN NOT NULL,
    `isSprinter` BOOLEAN NOT NULL,
    `isMarathoner` BOOLEAN NOT NULL,
    `isLeader` BOOLEAN NOT NULL,
    `isStroker` BOOLEAN NOT NULL,

    UNIQUE INDEX `paddlerStats_athleteId_key`(`athleteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_competitionId_fkey` FOREIGN KEY (`competitionId`) REFERENCES `regatta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lineup` ADD CONSTRAINT `lineup_rosterId_fkey` FOREIGN KEY (`rosterId`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paddlerStats` ADD CONSTRAINT `paddlerStats_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
