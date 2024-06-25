/*
  Warnings:

  - You are about to drop the column `maximum_people` on the `events` table. All the data in the column will be lost.
  - Added the required column `maximum_peoples` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "peoples" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "peoples_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "maximum_peoples" INTEGER NOT NULL
);
INSERT INTO "new_events" ("description", "id", "slug", "title") SELECT "description", "id", "slug", "title" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
PRAGMA foreign_key_check("events");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "peoples_email_key" ON "peoples"("email");
