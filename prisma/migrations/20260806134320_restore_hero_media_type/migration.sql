-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AcademicLifeItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€¦Ã‚Â¡',
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
CREATE TABLE "new_HeroSlide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT
);
INSERT INTO "new_HeroSlide" ("altText", "buttonLink", "buttonText", "createdAt", "displayOrder", "id", "imageUrl", "isPublished", "subtitle", "title", "updatedAt") SELECT "altText", "buttonLink", "buttonText", "createdAt", "displayOrder", "id", "imageUrl", "isPublished", "subtitle", "title", "updatedAt" FROM "HeroSlide";
DROP TABLE "HeroSlide";
ALTER TABLE "new_HeroSlide" RENAME TO "HeroSlide";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
