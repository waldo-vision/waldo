-- CreateEnum
CREATE TYPE "GameplayType" AS ENUM ('VAL', 'CSG', 'TF2', 'APE', 'COD', 'R6S');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'MOD', 'ADMIN');

-- CreateTable
CREATE TABLE "WaldoPage" (
    "name" STRING NOT NULL,
    "maintenance" BOOL NOT NULL DEFAULT false,
    "isCustomAlert" BOOL NOT NULL DEFAULT false,
    "alertTitle" STRING,
    "alertDescription" STRING,
    "parentName" STRING NOT NULL,

    CONSTRAINT "WaldoPage_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "WaldoSite" (
    "name" STRING NOT NULL,
    "maintenance" BOOL NOT NULL DEFAULT false,
    "isCustomAlert" BOOL NOT NULL,
    "alertTitle" STRING,
    "alertDescription" STRING,

    CONSTRAINT "WaldoSite_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Gameplay" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "youtubeUrl" STRING NOT NULL,
    "gameplayType" "GameplayType" NOT NULL DEFAULT 'CSG',
    "isAnalyzed" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "Gameplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameplayVotes" (
    "id" STRING NOT NULL,
    "gameplayId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "isGame" BOOL NOT NULL DEFAULT false,
    "actualGame" "GameplayType" NOT NULL,

    CONSTRAINT "GameplayVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clip" (
    "id" STRING NOT NULL,
    "gameplayId" STRING NOT NULL,

    CONSTRAINT "Clip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "type" STRING NOT NULL,
    "provider" STRING NOT NULL,
    "providerAccountId" STRING NOT NULL,
    "refresh_token" STRING,
    "access_token" STRING,
    "expires_at" INT4,
    "token_type" STRING,
    "scope" STRING,
    "id_token" STRING,
    "session_state" STRING,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" STRING NOT NULL,
    "sessionToken" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING,
    "email" STRING,
    "emailVerified" TIMESTAMP(3),
    "image" STRING,
    "blacklisted" BOOL NOT NULL DEFAULT false,
    "role" "Roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" STRING NOT NULL,
    "token" STRING NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Gameplay_youtubeUrl_key" ON "Gameplay"("youtubeUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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
ALTER TABLE "Clip" ADD CONSTRAINT "Clip_gameplayId_fkey" FOREIGN KEY ("gameplayId") REFERENCES "Gameplay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;