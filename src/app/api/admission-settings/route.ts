import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

const defaults = {
  id: 1,
  heroTitle: "Online Application",
  heroSubtitle: "Apply to Join St Mary's Secondary School-Manja",
  vacanciesTitle: "Vacancies Open",
  vacanciesText: "We are currently accepting applications for the next intake.",

  step1Title: "1. Submit Application",
  step1Text:
    "Complete the online form below with accurate student and guardian details.",

  step2Title: "2. Assessment & Review",
  step2Text:
    "Our Admissions Office reviews submitted grades, results, and student history.",

  step3Title: "3. Admission & Reporting",
  step3Text:
    "Successful applicants receive official admission letters and guidelines for reporting.",

  formTitle: "Student Admission Application Form",
  formSubtitle:
    "Please fill in all required fields below to send your application directly to our admissions team.",

  submitButtonText: "Submit Application Form",

  successTitle: "Application submitted successfully!",
  successText:
    "Please keep this reference number. Our Admissions Office will contact you via phone or email.",

  documentsTitle: "Documents to Prepare & Bring During Admission",

  documentsItems:
    "Birth certificate (copy)\nMost recent end-of-term/PLE/UCE results\nTwo passport-size photos\nTestimonial from previous school\nFilled application form\nMedical form (provided after acceptance)",

  checklistTitle: "Requirements Checklist (PDF)",
  checklistDescription:
    "Download and print the required document list for physical submission.",

  checklistButtonText: "Coming soon",
  checklistUrl: "",

  classOptions:
    "Senior 1 (O-Level)\nSenior 2 (O-Level)\nSenior 3 (O-Level)\nSenior 4 (O-Level)\nSenior 5 (A-Level Arts/Sciences)\nSenior 6 (A-Level Arts/Sciences)",
};

export async function GET() {
  try {
    const settings = await prisma.admissionSettings.upsert({
      where: { id: 1 },
      update: {},
      create: defaults,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET admission settings error:", error);

    return NextResponse.json(
      { message: "Unable to load admission settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    const data = {
      heroTitle: String(body.heroTitle || "").trim(),
      heroSubtitle: String(body.heroSubtitle || "").trim(),
      vacanciesTitle: String(body.vacanciesTitle || "").trim(),
      vacanciesText: String(body.vacanciesText || "").trim(),

      step1Title: String(body.step1Title || "").trim(),
      step1Text: String(body.step1Text || "").trim(),
      step2Title: String(body.step2Title || "").trim(),
      step2Text: String(body.step2Text || "").trim(),
      step3Title: String(body.step3Title || "").trim(),
      step3Text: String(body.step3Text || "").trim(),

      formTitle: String(body.formTitle || "").trim(),
      formSubtitle: String(body.formSubtitle || "").trim(),
      submitButtonText: String(body.submitButtonText || "").trim(),

      successTitle: String(body.successTitle || "").trim(),
      successText: String(body.successText || "").trim(),

      documentsTitle: String(body.documentsTitle || "").trim(),
      documentsItems: String(body.documentsItems || "").trim(),

      checklistTitle: String(body.checklistTitle || "").trim(),
      checklistDescription: String(body.checklistDescription || "").trim(),
      checklistButtonText: String(body.checklistButtonText || "").trim(),
      checklistUrl: String(body.checklistUrl || "").trim(),

      classOptions: String(body.classOptions || "").trim(),
    };

    const settings = await prisma.admissionSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT admission settings error:", error);

    return NextResponse.json(
      { message: "Unable to save admission settings." },
      { status: 500 }
    );
  }
}
