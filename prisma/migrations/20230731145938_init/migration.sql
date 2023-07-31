-- DropForeignKey
ALTER TABLE `lineup` DROP FOREIGN KEY `lineup_teamId_fkey`;

-- AddForeignKey
ALTER TABLE `lineup` ADD CONSTRAINT `lineup_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
