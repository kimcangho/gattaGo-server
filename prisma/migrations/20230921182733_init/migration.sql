-- DropForeignKey
ALTER TABLE `LineupPlanSection` DROP FOREIGN KEY `LineupPlanSection_racePlanId_fkey`;

-- AddForeignKey
ALTER TABLE `LineupPlanSection` ADD CONSTRAINT `LineupPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
