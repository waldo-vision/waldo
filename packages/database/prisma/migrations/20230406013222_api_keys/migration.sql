-- CreateEnum
CREATE TYPE "ApiKeyState" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" STRING NOT NULL,
    "keyOwnerId" STRING NOT NULL,
    "state" "ApiKeyState" NOT NULL,
    "key" STRING NOT NULL,
    "name" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_keyOwnerId_fkey" FOREIGN KEY ("keyOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
