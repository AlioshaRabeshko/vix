-- CreateTable
CREATE TABLE `crypto_historical_data` (
    `timestamp` DATETIME(3) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `openPrice` VARCHAR(191) NOT NULL,
    `closePrice` VARCHAR(191) NOT NULL,
    `high` VARCHAR(191) NOT NULL,
    `low` VARCHAR(191) NOT NULL,
    `volume` VARCHAR(191) NOT NULL,
    `quoteAssetVolume` VARCHAR(191) NOT NULL,
    `trades` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `crypto_historical_data_symbol_timestamp_key`(`symbol`, `timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
