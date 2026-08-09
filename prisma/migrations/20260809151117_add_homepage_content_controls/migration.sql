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
    "updatedAt" DATETIME NOT NULL,
    "valuesEyebrow" TEXT NOT NULL DEFAULT 'Our Values',
    "valuesDescription" TEXT NOT NULL DEFAULT 'The pillars that guide us in nurturing disciplined, responsible and successful citizens.',
    "introductionButtonText" TEXT NOT NULL DEFAULT 'Discover Our School',
    "introductionButtonLink" TEXT NOT NULL DEFAULT '/about',
    "academicLifeEyebrow" TEXT NOT NULL DEFAULT 'Learning in Action',
    "academicLifeTitle" TEXT NOT NULL DEFAULT 'Academic and Student Life',
    "academicLifeDescription" TEXT NOT NULL DEFAULT 'Our students learn through classroom teaching, field studies, educational tours, culture and community participation.',
    "academicLifeButtonText" TEXT NOT NULL DEFAULT 'Explore Our Academics',
    "academicLifeButtonLink" TEXT NOT NULL DEFAULT '/academics',
    "admissionsEyebrow" TEXT NOT NULL DEFAULT 'Admissions Open',
    "admissionsHeading" TEXT NOT NULL DEFAULT 'Join St Mary''s Secondary School-Manja',
    "admissionsDescription" TEXT NOT NULL DEFAULT 'Begin your journey in a disciplined, supportive and academically focused school community.',
    "admissionsPrimaryText" TEXT NOT NULL DEFAULT 'Apply Now',
    "admissionsPrimaryLink" TEXT NOT NULL DEFAULT '/admissions',
    "admissionsSecondaryText" TEXT NOT NULL DEFAULT 'Contact the School',
    "admissionsSecondaryLink" TEXT NOT NULL DEFAULT '/contact'
);
INSERT INTO "new_WebsiteSettings" ("admissionsLink", "admissionsText", "centreCode", "coreValues", "createdAt", "email", "heroSubtitle", "heroTitle", "id", "introductionImage", "introductionMediaType", "introductionText", "introductionTitle", "location", "mapUrl", "mission", "motto", "phone", "schoolName", "shortName", "tagline", "updatedAt", "vision", "whatsappNumber") SELECT "admissionsLink", "admissionsText", "centreCode", "coreValues", "createdAt", "email", "heroSubtitle", "heroTitle", "id", "introductionImage", "introductionMediaType", "introductionText", "introductionTitle", "location", "mapUrl", "mission", "motto", "phone", "schoolName", "shortName", "tagline", "updatedAt", "vision", "whatsappNumber" FROM "WebsiteSettings";
DROP TABLE "WebsiteSettings";
ALTER TABLE "new_WebsiteSettings" RENAME TO "WebsiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
