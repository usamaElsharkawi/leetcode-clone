/*
  Warnings:

  - You are about to drop the column `stdot` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `Time` on the `TestCaseResult` table. All the data in the column will be lost.
  - You are about to drop the column `taseCase` on the `TestCaseResult` table. All the data in the column will be lost.
  - Added the required column `testCase` to the `TestCaseResult` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `TestCaseResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "stdot",
ADD COLUMN     "stdout" TEXT;

-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "Time",
DROP COLUMN "taseCase",
ADD COLUMN     "memory" TEXT,
ADD COLUMN     "testCase" INTEGER NOT NULL,
ADD COLUMN     "time" TEXT,
ALTER COLUMN "status" SET NOT NULL;
