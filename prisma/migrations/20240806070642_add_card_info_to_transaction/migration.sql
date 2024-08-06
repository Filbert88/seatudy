/*
  Warnings:

  - Added the required column `cardHolderName` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardNumber` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cvc` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
ALTER TABLE "Transaction" ADD COLUMN     "cardHolderName" TEXT NOT NULL,
ADD COLUMN     "cardNumber" TEXT NOT NULL,
ADD COLUMN     "cvc" TEXT NOT NULL,
ADD COLUMN     "expirationDate" TEXT NOT NULL;
