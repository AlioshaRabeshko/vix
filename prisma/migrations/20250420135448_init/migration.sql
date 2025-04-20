/*
  Warnings:

  - Added the required column `query` to the `daily_news_analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `daily_news_analysis` ADD COLUMN `query` VARCHAR(191) NOT NULL;
