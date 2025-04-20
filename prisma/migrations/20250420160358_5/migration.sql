/*
  Warnings:

  - You are about to alter the column `value` on the `put_call_ratio` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `put_call_ratio` MODIFY `value` DOUBLE NOT NULL;
