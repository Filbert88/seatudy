/*
  Warnings:

  - Added the required column `title` to the `ForumPost` table without a default value. This is not possible if the table is not empty.

*/
ALTER TABLE "ForumPost" ADD COLUMN     "title" TEXT NOT NULL;
