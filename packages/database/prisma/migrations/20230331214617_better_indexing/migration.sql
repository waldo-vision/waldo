-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Gameplay_userId_idx" ON "Gameplay"("userId");

-- CreateIndex
CREATE INDEX "GameplayVotes_gameplayId_idx" ON "GameplayVotes"("gameplayId");
