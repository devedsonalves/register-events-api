/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `peoples` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "people_id" INTEGER NOT NULL,
    CONSTRAINT "check_ins_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "peoples" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "peoples_event_id_email_key" ON "peoples"("event_id", "email");
