/*
  Warnings:

  - You are about to drop the column `transaction` on the `crypto_macro_data` table. All the data in the column will be lost.
  - Added the required column `transactions` to the `crypto_macro_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `crypto_macro_data` DROP COLUMN `transaction`,
    ADD COLUMN `transactions` INTEGER NOT NULL;
