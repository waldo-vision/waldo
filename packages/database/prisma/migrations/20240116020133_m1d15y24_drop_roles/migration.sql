-- CreateEnum
CREATE TYPE "CheatType" AS ENUM ('NOCHEAT', 'AIMBOT', 'TRIGGERBOT', 'ESP', 'SPINBOT');

-- CreateEnum
CREATE TYPE "GameplayType" AS ENUM ('VAL', 'CSG', 'TF2', 'APE', 'COD', 'R6S', 'OW2', 'CS2');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'TRUSTED', 'MOD', 'ADMIN');

-- CreateEnum
CREATE TYPE "InfractionType" AS ENUM ('CORRECTION', 'WARNING', 'SUSPENSION', 'PERMA_SUSPENSION');

-- CreateEnum
CREATE TYPE "ApiKeyState" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "WaldoPage" (
    "name" TEXT NOT NULL,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,
    "isCustomAlert" BOOLEAN NOT NULL DEFAULT false,
    "alertTitle" TEXT,
    "alertDescription" TEXT,
    "parentName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaldoPage_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "WaldoSite" (
    "name" TEXT NOT NULL,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,
    "isCustomAlert" BOOLEAN NOT NULL,
    "alertTitle" TEXT,
    "alertDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaldoSite_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Gameplay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "gameplayType" "GameplayType" NOT NULL DEFAULT 'CSG',
    "isAnalyzed" BOOLEAN NOT NULL DEFAULT false,
    "cheats" "CheatType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gameplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameplayVotes" (
    "id" TEXT NOT NULL,
    "gameplayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isGame" BOOLEAN NOT NULL DEFAULT false,
    "actualGame" "GameplayType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameplayVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clip" (
    "id" TEXT NOT NULL,
    "gameplayId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "V2Account" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "logtoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "V2Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Infractions" (
    "infractionId" TEXT NOT NULL,
    "type" "InfractionType" NOT NULL DEFAULT 'CORRECTION',
    "subjectId" TEXT NOT NULL,
    "executed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Infractions_pkey" PRIMARY KEY ("infractionId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "keyOwnerId" TEXT NOT NULL,
    "state" "ApiKeyState" NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Gameplay_youtubeUrl_key" ON "Gameplay"("youtubeUrl");

-- CreateIndex
CREATE INDEX "Gameplay_userId_idx" ON "Gameplay"("userId");

-- CreateIndex
CREATE INDEX "GameplayVotes_gameplayId_idx" ON "GameplayVotes"("gameplayId");

-- CreateIndex
CREATE UNIQUE INDEX "V2Account_logtoId_key" ON "V2Account"("logtoId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "WaldoPage" ADD CONSTRAINT "WaldoPage_parentName_fkey" FOREIGN KEY ("parentName") REFERENCES "WaldoSite"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gameplay" ADD CONSTRAINT "Gameplay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameplayVotes" ADD CONSTRAINT "GameplayVotes_gameplayId_fkey" FOREIGN KEY ("gameplayId") REFERENCES "Gameplay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameplayVotes" ADD CONSTRAINT "GameplayVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clip" ADD CONSTRAINT "Clip_gameplayId_fkey" FOREIGN KEY ("gameplayId") REFERENCES "Gameplay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "V2Account" ADD CONSTRAINT "V2Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Infractions" ADD CONSTRAINT "Infractions_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_keyOwnerId_fkey" FOREIGN KEY ("keyOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
