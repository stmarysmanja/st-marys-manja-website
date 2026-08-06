-- CreateTable
CREATE TABLE "WebsiteSettings" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LeadershipMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "title" TEXT,
    "photo" TEXT,
    "theme" TEXT,
    "message" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
