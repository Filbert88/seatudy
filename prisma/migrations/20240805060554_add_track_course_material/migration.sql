CREATE TABLE "CourseMaterialAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseMaterialId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseMaterialAccess_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CourseMaterialAccess_userId_courseMaterialId_key" ON "CourseMaterialAccess"("userId", "courseMaterialId");

ALTER TABLE "CourseMaterialAccess" ADD CONSTRAINT "CourseMaterialAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CourseMaterialAccess" ADD CONSTRAINT "CourseMaterialAccess_courseMaterialId_fkey" FOREIGN KEY ("courseMaterialId") REFERENCES "CourseMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
