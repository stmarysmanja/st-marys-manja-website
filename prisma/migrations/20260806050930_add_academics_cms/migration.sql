-- CreateTable
CREATE TABLE "AcademicSettings" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AcademicLifeItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'ðŸ“š',
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
