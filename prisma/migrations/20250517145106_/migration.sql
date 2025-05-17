/*
  Warnings:

  - You are about to drop the `crypto_historical_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `crypto_historical_data`;

-- CreateTable
CREATE TABLE `crypto_symbol_data` (
    `timestamp` DATETIME(3) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `openPrice` VARCHAR(191) NOT NULL,
    `closePrice` VARCHAR(191) NOT NULL,
    `high` VARCHAR(191) NOT NULL,
    `low` VARCHAR(191) NOT NULL,
    `volume` VARCHAR(191) NOT NULL,
    `quoteAssetVolume` VARCHAR(191) NOT NULL,
    `trades` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `crypto_symbol_data_symbol_timestamp_key`(`symbol`, `timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_macro_data` (
    `timestamp` DATETIME(3) NOT NULL,
    `eth_dominance` VARCHAR(191) NOT NULL,
    `btc_dominance` VARCHAR(191) NOT NULL,
    `stablecoin_volume_24h` VARCHAR(191) NOT NULL,
    `derivatives_volume_24h` VARCHAR(191) NOT NULL,
    `today_change_percent` VARCHAR(191) NOT NULL,
    `total_volume_24h` VARCHAR(191) NOT NULL,
    `total_market_cap` VARCHAR(191) NOT NULL,
    `stablecoin_market_cap` VARCHAR(191) NOT NULL,
    `altcoin_market_cap` VARCHAR(191) NOT NULL,
    `defi_market_cap` VARCHAR(191) NOT NULL,
    `fear_index` INTEGER NOT NULL,
    `transaction` INTEGER NOT NULL,
    `hash_rate` INTEGER NOT NULL,

    UNIQUE INDEX `crypto_macro_data_timestamp_key`(`timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_metadata` (
    `timestamp` DATETIME(3) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `circulating_supply` VARCHAR(191) NOT NULL,
    `total_supply` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `volume_24h` VARCHAR(191) NOT NULL,
    `market_cap` VARCHAR(191) NOT NULL,
    `market_cap_dominance` VARCHAR(191) NOT NULL,
    `fully_diluted_market_cap` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `crypto_metadata_symbol_timestamp_key`(`symbol`, `timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whale_alerts` (
    `timestamp` DATETIME(3) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `value_usd` INTEGER NOT NULL,

    UNIQUE INDEX `whale_alerts_symbol_timestamp_key`(`symbol`, `timestamp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
