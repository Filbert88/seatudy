-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "cardHolderName" DROP NOT NULL,
ALTER COLUMN "cardNumber" DROP NOT NULL,
ALTER COLUMN "cvc" DROP NOT NULL,
ALTER COLUMN "expirationDate" DROP NOT NULL;