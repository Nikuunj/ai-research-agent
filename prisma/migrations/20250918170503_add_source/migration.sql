/*
  Warnings:

  - Added the required column `source` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Result" ADD COLUMN     "source" TEXT NOT NULL;
