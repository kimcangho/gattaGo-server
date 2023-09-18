-- AlterTable
ALTER TABLE `eventPlanSection` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `startTime` DATETIME(3) NULL,
    MODIFY `distance` VARCHAR(191) NULL,
    MODIFY `lane` INTEGER NULL;

-- AlterTable
ALTER TABLE `notesPlanSection` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `body` MEDIUMTEXT NULL;

-- AlterTable
ALTER TABLE `regattaPlanSection` MODIFY `startDate` DATETIME(3) NULL,
    MODIFY `endDate` DATETIME(3) NULL;
