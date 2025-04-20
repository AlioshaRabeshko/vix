/*
  Warnings:

  - You are about to alter the column `price` on the `stock_data` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `forwardPe` on the `stock_data` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `trailingPe` on the `stock_data` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `value` on the `vix` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `stock_data` MODIFY `price` DOUBLE NULL,
    MODIFY `forwardPe` DOUBLE NULL,
    MODIFY `trailingPe` DOUBLE NULL;

-- AlterTable
ALTER TABLE `vix` MODIFY `value` DOUBLE NOT NULL;
