-- CreateTable
CREATE TABLE "AdmissionApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicationNumber" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TEXT,
    "applyingClass" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "parentEmail" TEXT,
    "previousSchool" TEXT NOT NULL,
    "pleResults" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionApplication_applicationNumber_key" ON "AdmissionApplication"("applicationNumber");
