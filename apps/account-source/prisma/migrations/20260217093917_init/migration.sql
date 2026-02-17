-- CreateTable
CREATE TABLE "user_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "plan_type" TEXT NOT NULL,
    "data_limit_gb" REAL NOT NULL,
    "data_used_gb" REAL NOT NULL DEFAULT 0,
    "balance" REAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "bill_date" TEXT,
    "brand" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_user_id_key" ON "user_accounts"("user_id");

-- CreateIndex
CREATE INDEX "user_accounts_brand_idx" ON "user_accounts"("brand");
