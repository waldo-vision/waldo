-- CreateEnum
CREATE TYPE "CheatType" AS ENUM ('NOCHEAT', 'AIMBOT', 'TRIGGERBOT', 'ESP', 'SPINBOT');

-- AlterEnum
ALTER TYPE "Roles"ADD VALUE 'TRUSTED';

-- AlterTable
ALTER TABLE "Gameplay" ADD COLUMN     "cheats" "CheatType"[];
