-- DropForeignKey
ALTER TABLE "Clip" DROP CONSTRAINT "Clip_gameplayId_fkey";

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "Clip_gameplayId_fkey" FOREIGN KEY ("gameplayId") REFERENCES "Gameplay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
