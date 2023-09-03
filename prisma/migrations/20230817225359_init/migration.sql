-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PasswordReset_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `authRefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `authRefreshToken_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `division` VARCHAR(255) NOT NULL,
    `level` VARCHAR(255) NOT NULL,
    `eligibility` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lineup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `athlete` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `eligibility` VARCHAR(255) NOT NULL,
    `paddleSide` VARCHAR(255) NOT NULL,
    `weight` INTEGER NULL,
    `email` VARCHAR(255) NOT NULL,
    `notes` MEDIUMTEXT NOT NULL,
    `isAvailable` BOOLEAN NOT NULL,
    `isManager` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `athlete_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `athletesInTeams` (
    `teamId` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`teamId`, `athleteId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `athletesInLineups` (
    `lineupId` VARCHAR(191) NOT NULL,
    `athleteId` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`lineupId`, `athleteId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lineup` ADD CONSTRAINT `lineup_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paddlerSkills` ADD CONSTRAINT `paddlerSkills_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athletesInTeams` ADD CONSTRAINT `athletesInTeams_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athletesInTeams` ADD CONSTRAINT `athletesInTeams_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `athlete`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athletesInLineups` ADD CONSTRAINT `athletesInLineups_lineupId_fkey` FOREIGN KEY (`lineupId`) REFERENCES `lineup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athletesInLineups` ADD CONSTRAINT `athletesInLineups_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `athlete`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
