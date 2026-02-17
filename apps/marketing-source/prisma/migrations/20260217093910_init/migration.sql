-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image_url" TEXT,
    "badge" TEXT,
    "brand" TEXT NOT NULL,
    "segment" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "image_url" TEXT NOT NULL,
    "action" TEXT,
    "brand" TEXT NOT NULL,
    "segment" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "offers_brand_idx" ON "offers"("brand");

-- CreateIndex
CREATE INDEX "offers_brand_segment_idx" ON "offers"("brand", "segment");

-- CreateIndex
CREATE INDEX "banners_brand_idx" ON "banners"("brand");

-- CreateIndex
CREATE INDEX "banners_brand_segment_idx" ON "banners"("brand", "segment");
