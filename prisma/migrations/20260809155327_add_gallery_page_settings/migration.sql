-- CreateTable
CREATE TABLE "GallerySettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "eyebrow" TEXT NOT NULL DEFAULT 'School Life',
    "title" TEXT NOT NULL DEFAULT 'School Gallery',
    "description" TEXT NOT NULL DEFAULT 'Highlights of academic activities, sports events, educational trips and co-curricular life at St Mary''s Secondary School-Manja.',
    "emptyTitle" TEXT NOT NULL DEFAULT 'Gallery Coming Soon',
    "emptyText" TEXT NOT NULL DEFAULT 'Photographs and videos will appear here after they are published from the Admin Portal.',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
