/*
  Warnings:

  - The values [CORRECTION] on the enum `InfractionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `GameplayVotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InfractionType_new" AS ENUM ('WARNING', 'SUSPENSION', 'PERMA_SUSPENSION');
ALTER TABLE "Infractions" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Infractions" ALTER COLUMN "type" TYPE "InfractionType_new" USING ("type"::text::"InfractionType_new");
ALTER TYPE "InfractionType" RENAME TO "InfractionType_old";
ALTER TYPE "InfractionType_new" RENAME TO "InfractionType";
DROP TYPE "InfractionType_old";
ALTER TABLE "Infractions" ALTER COLUMN "type" SET DEFAULT 'WARNING';
COMMIT;

-- DropForeignKey
ALTER TABLE "GameplayVotes" DROP CONSTRAINT "GameplayVotes_gameplayId_fkey";

-- DropForeignKey
ALTER TABLE "GameplayVotes" DROP CONSTRAINT "GameplayVotes_userId_fkey";

-- AlterTable
ALTER TABLE "Infractions" ALTER COLUMN "type" SET DEFAULT 'WARNING';

-- DropTable
DROP TABLE "GameplayVotes";

-- CreateTable
CREATE TABLE "GameplayVote" (
    "id" TEXT NOT NULL,
    "gameplayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isGame" BOOLEAN NOT NULL DEFAULT false,
    "actualGame" "GameplayType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameplayVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameplayVote_gameplayId_idx" ON "GameplayVote"("gameplayId");

-- AddForeignKey
ALTER TABLE "GameplayVote" ADD CONSTRAINT "GameplayVote_gameplayId_fkey" FOREIGN KEY ("gameplayId") REFERENCES "Gameplay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameplayVote" ADD CONSTRAINT "GameplayVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
