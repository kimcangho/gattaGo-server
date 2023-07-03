/*
  Warnings:

  - You are about to drop the column `isMarathoner` on the `paddlerStats` table. All the data in the column will be lost.
  - You are about to drop the column `isSprinter` on the `paddlerStats` table. All the data in the column will be lost.
  - You are about to drop the column `paddledSince` on the `paddlerStats` table. All the data in the column will be lost.
  - Added the required column `is1000m` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is2000m` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is200m` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is500m` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBailer` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCaller` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isEngine` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isInjuryProne` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isLagging` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isLoadManaged` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isNewbie` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPacer` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRocket` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRushing` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSteadyTempo` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTechnicallyPoor` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTechnicallyProficient` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVeteran` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVocal` to the `paddlerStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `paddlerStats` DROP COLUMN `isMarathoner`,
    DROP COLUMN `isSprinter`,
    DROP COLUMN `paddledSince`,
    ADD COLUMN `is1000m` BOOLEAN NOT NULL,
    ADD COLUMN `is2000m` BOOLEAN NOT NULL,
    ADD COLUMN `is200m` BOOLEAN NOT NULL,
    ADD COLUMN `is500m` BOOLEAN NOT NULL,
    ADD COLUMN `isBailer` BOOLEAN NOT NULL,
    ADD COLUMN `isCaller` BOOLEAN NOT NULL,
    ADD COLUMN `isEngine` BOOLEAN NOT NULL,
    ADD COLUMN `isInjuryProne` BOOLEAN NOT NULL,
    ADD COLUMN `isLagging` BOOLEAN NOT NULL,
    ADD COLUMN `isLoadManaged` BOOLEAN NOT NULL,
    ADD COLUMN `isNewbie` BOOLEAN NOT NULL,
    ADD COLUMN `isPacer` BOOLEAN NOT NULL,
    ADD COLUMN `isRocket` BOOLEAN NOT NULL,
    ADD COLUMN `isRushing` BOOLEAN NOT NULL,
    ADD COLUMN `isSteadyTempo` BOOLEAN NOT NULL,
    ADD COLUMN `isTechnicallyPoor` BOOLEAN NOT NULL,
    ADD COLUMN `isTechnicallyProficient` BOOLEAN NOT NULL,
    ADD COLUMN `isVeteran` BOOLEAN NOT NULL,
    ADD COLUMN `isVocal` BOOLEAN NOT NULL;
