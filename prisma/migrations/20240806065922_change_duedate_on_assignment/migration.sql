/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Assignment` table. All the data in the column will be lost.

*/
ALTER TABLE "Assignment" DROP COLUMN "dueDate",
ADD COLUMN     "dueDateOffset" INTEGER NOT NULL DEFAULT 0;
