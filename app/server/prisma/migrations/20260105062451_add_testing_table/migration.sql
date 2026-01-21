/*
  Warnings:

  - Added the required column `testing_column` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "testing_column" TEXT NOT NULL;
