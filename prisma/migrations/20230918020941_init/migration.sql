-- DropForeignKey
ALTER TABLE `planSection` DROP FOREIGN KEY `planSection_racePlanId_fkey`;

-- AddForeignKey
ALTER TABLE `planSection` ADD CONSTRAINT `planSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
