-- CreateTable
CREATE TABLE "AdmissionSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "heroTitle" TEXT NOT NULL DEFAULT 'Online Application',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Apply to Join St Mary''s Secondary School-Manja',
    "vacanciesTitle" TEXT NOT NULL DEFAULT 'Vacancies Open',
    "vacanciesText" TEXT NOT NULL DEFAULT 'We are currently accepting applications for the next intake.',
    "step1Title" TEXT NOT NULL DEFAULT '1. Submit Application',
    "step1Text" TEXT NOT NULL DEFAULT 'Complete the online form below with accurate student and guardian details.',
    "step2Title" TEXT NOT NULL DEFAULT '2. Assessment & Review',
    "step2Text" TEXT NOT NULL DEFAULT 'Our Admissions Office reviews submitted grades, results, and student history.',
    "step3Title" TEXT NOT NULL DEFAULT '3. Admission & Reporting',
    "step3Text" TEXT NOT NULL DEFAULT 'Successful applicants receive official admission letters and guidelines for reporting.',
    "formTitle" TEXT NOT NULL DEFAULT 'Student Admission Application Form',
    "formSubtitle" TEXT NOT NULL DEFAULT 'Please fill in all required fields below to send your application directly to our admissions team.',
    "submitButtonText" TEXT NOT NULL DEFAULT 'Submit Application Form',
    "successTitle" TEXT NOT NULL DEFAULT 'Application submitted successfully!',
    "successText" TEXT NOT NULL DEFAULT 'Please keep this reference number. Our Admissions Office will contact you via phone or email.',
    "documentsTitle" TEXT NOT NULL DEFAULT 'Documents to Prepare & Bring During Admission',
    "documentsItems" TEXT NOT NULL DEFAULT 'Birth certificate (copy)
Most recent end-of-term/PLE/UCE results
Two passport-size photos
Testimonial from previous school
Filled application form
Medical form (provided after acceptance)',
    "checklistTitle" TEXT NOT NULL DEFAULT 'Requirements Checklist (PDF)',
    "checklistDescription" TEXT NOT NULL DEFAULT 'Download and print the required document list for physical submission.',
    "checklistButtonText" TEXT NOT NULL DEFAULT 'Coming soon',
    "checklistUrl" TEXT NOT NULL DEFAULT '',
    "classOptions" TEXT NOT NULL DEFAULT 'Senior 1 (O-Level)
Senior 2 (O-Level)
Senior 3 (O-Level)
Senior 4 (O-Level)
Senior 5 (A-Level Arts/Sciences)
Senior 6 (A-Level Arts/Sciences)',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
