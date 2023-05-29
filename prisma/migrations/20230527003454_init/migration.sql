-- CreateTable
CREATE TABLE `teamsInRegattas` (
    `regattaId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`regattaId`, `teamId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teamsInRegattas` ADD CONSTRAINT `teamsInRegattas_regattaId_fkey` FOREIGN KEY (`regattaId`) REFERENCES `regatta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamsInRegattas` ADD CONSTRAINT `teamsInRegattas_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
