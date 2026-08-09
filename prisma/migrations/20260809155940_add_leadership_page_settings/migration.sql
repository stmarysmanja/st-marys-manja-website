-- CreateTable
CREATE TABLE "LeadershipSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "eyebrow" TEXT NOT NULL DEFAULT 'Meet Our Team',
    "title" TEXT NOT NULL DEFAULT 'School Leadership',
    "description" TEXT NOT NULL DEFAULT 'Visionary leaders guiding academic excellence, discipline and holistic student development.',
    "emptyText" TEXT NOT NULL DEFAULT 'Leadership profiles will appear here after they are published from the Admin Portal.',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
