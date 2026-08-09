-- CreateTable
CREATE TABLE "NewsSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "eyebrow" TEXT NOT NULL DEFAULT 'School Updates',
    "title" TEXT NOT NULL DEFAULT 'News & Announcements',
    "description" TEXT NOT NULL DEFAULT 'Follow the latest academic, sports, events and school community updates.',
    "emptyTitle" TEXT NOT NULL DEFAULT 'No published news yet',
    "emptyText" TEXT NOT NULL DEFAULT 'Published school updates will appear here.',
    "pinnedLabel" TEXT NOT NULL DEFAULT 'Pinned',
    "readMoreText" TEXT NOT NULL DEFAULT 'Read More',
    "backText" TEXT NOT NULL DEFAULT 'Back to News',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
