-- CreateTable
CREATE TABLE `LineupPlanSection` (
    `id` VARCHAR(191) NOT NULL,
    `lineupName` VARCHAR(191) NULL,
    `lineupId` VARCHAR(191) NULL,
    `racePlanId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LineupPlanSection` ADD CONSTRAINT `LineupPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
