/*
  Warnings:

  - You are about to drop the `whale_alerts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `whale_alerts`;

-- CreateTable
CREATE TABLE `crypto_whale_alerts` (
    `timestamp` DATETIME(3) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `value_usd` INTEGER NOT NULL,

    UNIQUE INDEX `crypto_whale_alerts_symbol_timestamp_key`(`symbol`, `timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
