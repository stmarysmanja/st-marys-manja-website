-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AcademicLifeItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Book',
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
CREATE TABLE "new_AcademicSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroMediaUrl" TEXT NOT NULL,
    "heroMediaType" TEXT NOT NULL DEFAULT 'image',
    "oLevelTitle" TEXT NOT NULL,
    "oLevelDescription" TEXT NOT NULL,
    "oLevelItems" TEXT NOT NULL,
    "aLevelTitle" TEXT NOT NULL,
    "aLevelDescription" TEXT NOT NULL,
    "aLevelSciences" TEXT NOT NULL,
    "aLevelArts" TEXT NOT NULL,
    "aLevelSubsidiaries" TEXT NOT NULL,
    "departmentsText" TEXT NOT NULL,
    "subjectsText" TEXT NOT NULL,
    "performanceText" TEXT NOT NULL,
    "calendarText" TEXT NOT NULL,
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Learning for Life',
    "oLevelButtonText" TEXT NOT NULL DEFAULT 'Learn More',
    "oLevelButtonLink" TEXT NOT NULL DEFAULT '#subjects',
    "aLevelButtonText" TEXT NOT NULL DEFAULT 'Learn More',
    "aLevelButtonLink" TEXT NOT NULL DEFAULT '#subjects',
    "academicLifeEyebrow" TEXT NOT NULL DEFAULT 'Learning in Action',
    "academicLifeTitle" TEXT NOT NULL DEFAULT 'Academic Life',
    "academicLifeDescription" TEXT NOT NULL DEFAULT 'A glimpse into the learning experiences and opportunities that shape our students every day.',
    "departmentsTitle" TEXT NOT NULL DEFAULT 'Academic Departments',
    "subjectsTitle" TEXT NOT NULL DEFAULT 'Subjects Offered',
    "performanceTitle" TEXT NOT NULL DEFAULT 'Academic Performance',
    "calendarTitle" TEXT NOT NULL DEFAULT 'School Calendar',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AcademicSettings" ("aLevelArts", "aLevelDescription", "aLevelSciences", "aLevelSubsidiaries", "aLevelTitle", "calendarText", "createdAt", "departmentsText", "heroMediaType", "heroMediaUrl", "heroSubtitle", "heroTitle", "id", "oLevelDescription", "oLevelItems", "oLevelTitle", "performanceText", "subjectsText", "updatedAt") SELECT "aLevelArts", "aLevelDescription", "aLevelSciences", "aLevelSubsidiaries", "aLevelTitle", "calendarText", "createdAt", "departmentsText", "heroMediaType", "heroMediaUrl", "heroSubtitle", "heroTitle", "id", "oLevelDescription", "oLevelItems", "oLevelTitle", "performanceText", "subjectsText", "updatedAt" FROM "AcademicSettings";
DROP TABLE "AcademicSettings";
ALTER TABLE "new_AcademicSettings" RENAME TO "AcademicSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
