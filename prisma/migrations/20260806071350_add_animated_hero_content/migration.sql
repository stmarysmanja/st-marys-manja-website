-- AlterTable
ALTER TABLE "HeroSlide" ADD COLUMN "buttonLink" TEXT;
ALTER TABLE "HeroSlide" ADD COLUMN "buttonText" TEXT;
ALTER TABLE "HeroSlide" ADD COLUMN "subtitle" TEXT;
ALTER TABLE "HeroSlide" ADD COLUMN "title" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AcademicLifeItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Ã°Å¸â€œÅ¡',
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AcademicLifeItem" ("createdAt", "description", "displayOrder", "icon", "id", "isPublished", "mediaType", "mediaUrl", "title", "updatedAt") SELECT "createdAt", "description", "displayOrder", "icon", "id", "isPublished", "mediaType", "mediaUrl", "title", "updatedAt" FROM "AcademicLifeItem";
DROP TABLE "AcademicLifeItem";
ALTER TABLE "new_AcademicLifeItem" RENAME TO "AcademicLifeItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
