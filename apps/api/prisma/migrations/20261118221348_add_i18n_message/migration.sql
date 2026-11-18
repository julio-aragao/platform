-- CreateTable
CREATE TABLE "i18n_message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL,

    CONSTRAINT "i18n_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "i18n_message_name_locale_key" ON "i18n_message"("name", "locale");
