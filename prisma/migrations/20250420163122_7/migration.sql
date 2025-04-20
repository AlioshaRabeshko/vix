/*
  Warnings:

  - A unique constraint covering the columns `[keyword,date]` on the table `google_trends` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `google_trends` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `google_trends` ADD COLUMN `date` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `google_trends_keyword_date_key` ON `google_trends`(`keyword`, `date`);
