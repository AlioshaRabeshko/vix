-- CreateTable
CREATE TABLE `cnn_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `value` DOUBLE NOT NULL,
    `rating` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,
    `score` INTEGER NULL,

    UNIQUE INDEX `cnn_data_keyword_date_key`(`keyword`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
