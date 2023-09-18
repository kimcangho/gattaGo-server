-- AlterTable
ALTER TABLE `racePlan` ADD COLUMN `planOrderId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `racePlan` ADD CONSTRAINT `racePlan_planOrderId_fkey` FOREIGN KEY (`planOrderId`) REFERENCES `planOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
