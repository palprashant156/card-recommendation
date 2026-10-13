-- CreateTable
CREATE TABLE "CardProduct" (
    "id" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "highlight" TEXT,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "supportsPrime" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardRule" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "ratePct" DOUBLE PRECISION NOT NULL,
    "primeRatePct" DOUBLE PRECISION,
    "capPerTxn" DOUBLE PRECISION,
    "minTxn" DOUBLE PRECISION,
    "pointValueRs" DOUBLE PRECISION,
    "validTill" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "sourceUrl" TEXT,
    "lastVerified" TEXT NOT NULL,
    "exclusionNote" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "benefit" TEXT NOT NULL,
    "minTxn" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "expiry" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "exclusions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUser" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "cardIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prime" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "merchantId" TEXT NOT NULL,
    "merchantName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "cardId" TEXT NOT NULL,
    "cardLabel" TEXT NOT NULL,
    "benefit" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "contact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardProduct_issuer_idx" ON "CardProduct"("issuer");

-- CreateIndex
CREATE INDEX "RewardRule_cardId_merchantId_idx" ON "RewardRule"("cardId", "merchantId");

-- CreateIndex
CREATE INDEX "Offer_merchantId_cardId_idx" ON "Offer"("merchantId", "cardId");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_deviceId_key" ON "AppUser"("deviceId");

-- CreateIndex
CREATE INDEX "RecommendationHistory_userId_createdAt_idx" ON "RecommendationHistory"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "RewardRule" ADD CONSTRAINT "RewardRule_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardRule" ADD CONSTRAINT "RewardRule_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationHistory" ADD CONSTRAINT "RecommendationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
