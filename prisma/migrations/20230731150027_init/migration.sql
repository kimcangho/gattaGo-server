-- DropForeignKey
ALTER TABLE `athletesInLineups` DROP FOREIGN KEY `athletesInLineups_athleteId_fkey`;

-- DropForeignKey
ALTER TABLE `athletesInLineups` DROP FOREIGN KEY `athletesInLineups_lineupId_fkey`;

-- AddForeignKey
ALTER TABLE `athletesInLineups` ADD CONSTRAINT `athletesInLineups_lineupId_fkey` FOREIGN KEY (`lineupId`) REFERENCES `lineup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athletesInLineups` ADD CONSTRAINT `athletesInLineups_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `athlete`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
