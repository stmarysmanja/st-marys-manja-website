-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WebsiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "schoolName" TEXT NOT NULL DEFAULT 'St. Mary''s Secondary School - Manja',
    "shortName" TEXT NOT NULL DEFAULT 'St. Mary''s SS Manja',
    "tagline" TEXT NOT NULL DEFAULT 'Excellence & Virtue',
    "motto" TEXT NOT NULL DEFAULT 'We Learn by Doing',
    "vision" TEXT NOT NULL DEFAULT 'To be a Centre of Excellence all Round Achievers.',
    "mission" TEXT NOT NULL DEFAULT 'To produce practical, responsible citizens with high academic standards and moral values.',
    "coreValues" TEXT NOT NULL DEFAULT 'God-fearing, Discipline, Self-drive, High self-esteem.',
    "introductionTitle" TEXT NOT NULL DEFAULT 'Welcome to St. Mary''s Secondary School - Manja',
    "introductionText" TEXT NOT NULL DEFAULT 'St. Mary''s Secondary School Manja is dedicated to nurturing holistic growth in both O-Level and A-Level secondary education.',
    "heroTitle" TEXT NOT NULL DEFAULT 'St. Mary''s Secondary School',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Manja | Excellence & Virtue',
    "centreCode" TEXT NOT NULL DEFAULT 'ST MARYS MANJA',
    "admissionsText" TEXT NOT NULL DEFAULT 'Online Admissions',
    "admissionsLink" TEXT NOT NULL DEFAULT '/admissions',
    "whatsappNumber" TEXT NOT NULL DEFAULT '256700240640',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT 'Manja, Uganda',
    "mapUrl" TEXT NOT NULL DEFAULT 'https://maps.google.com/maps?q=Manja%20Secondary%20School%20Uganda&t=&z=13&ie=UTF8&iwloc=&output=embed',
    "introductionImage" TEXT NOT NULL DEFAULT '/Filed work.jpg',
    "introductionMediaType" TEXT NOT NULL DEFAULT 'image',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WebsiteSettings" ("admissionsLink", "admissionsText", "centreCode", "coreValues", "createdAt", "email", "heroSubtitle", "heroTitle", "id", "introductionImage", "introductionText", "introductionTitle", "location", "mapUrl", "mission", "motto", "phone", "schoolName", "shortName", "tagline", "updatedAt", "vision", "whatsappNumber") SELECT "admissionsLink", "admissionsText", "centreCode", "coreValues", "createdAt", "email", "heroSubtitle", "heroTitle", "id", "introductionImage", "introductionText", "introductionTitle", "location", "mapUrl", "mission", "motto", "phone", "schoolName", "shortName", "tagline", "updatedAt", "vision", "whatsappNumber" FROM "WebsiteSettings";
DROP TABLE "WebsiteSettings";
ALTER TABLE "new_WebsiteSettings" RENAME TO "WebsiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
