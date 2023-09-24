-- CreateTable
CREATE TABLE `mapPlanSection` (
    `id` VARCHAR(191) NOT NULL,
    `mapName` VARCHAR(191) NOT NULL,
    `mapLatitude` DOUBLE NOT NULL,
    `mapLongitude` DOUBLE NOT NULL,
    `mapZoom` DOUBLE NOT NULL,
    `racePlanId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mapPlanSection` ADD CONSTRAINT `mapPlanSection_racePlanId_fkey` FOREIGN KEY (`racePlanId`) REFERENCES `racePlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
