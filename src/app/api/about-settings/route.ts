import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

const defaults = {
  id: 1,
  heroEyebrow: "About Our School",
  heroTitle: "St. Mary's Secondary School-Manja",
  heroDescription:
    "Learn more about our school, our purpose, values and commitment to student development.",

  welcomeEyebrow: "Welcome",
  mottoLabel: "Our Motto",
  missionLabel: "Our Mission",
  visionLabel: "Our Vision",

  valuesEyebrow: "What Guides Us",
  valuesTitle: "Our Core Values",
  valuesDescription:
    "The principles that guide our school community and the development of our learners.",

  governanceEyebrow: "School Governance",
  governanceTitle: "Board of Governors",
  governanceDescription:
    "Our school is guided by committed leaders who support good governance, accountability and educational excellence.",

  anthemEyebrow: "Our Identity",
  anthemTitle: "School Anthem",
  anthemText:
    "Our school anthem reflects our identity, values, unity and commitment to excellence.",

  ctaTitle: "Join Our School Community",
  ctaDescription:
    "Begin your application or contact the school office for more information.",
  ctaPrimaryText: "Apply Now",
  ctaPrimaryLink: "/admissions",
  ctaSecondaryText: "Contact Us",
  ctaSecondaryLink: "/contact",
};

export async function GET() {
  try {
    const settings = await prisma.aboutSettings.upsert({
      where: { id: 1 },
      update: {},
      create: defaults,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET about settings error:", error);

    return NextResponse.json(
      { message: "Unable to load About settings." },
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
      heroEyebrow: String(body.heroEyebrow || "").trim(),
      heroTitle: String(body.heroTitle || "").trim(),
      heroDescription: String(body.heroDescription || "").trim(),

      welcomeEyebrow: String(body.welcomeEyebrow || "").trim(),
      mottoLabel: String(body.mottoLabel || "").trim(),
      missionLabel: String(body.missionLabel || "").trim(),
      visionLabel: String(body.visionLabel || "").trim(),

      valuesEyebrow: String(body.valuesEyebrow || "").trim(),
      valuesTitle: String(body.valuesTitle || "").trim(),
      valuesDescription: String(body.valuesDescription || "").trim(),

      governanceEyebrow: String(body.governanceEyebrow || "").trim(),
      governanceTitle: String(body.governanceTitle || "").trim(),
      governanceDescription: String(body.governanceDescription || "").trim(),

      anthemEyebrow: String(body.anthemEyebrow || "").trim(),
      anthemTitle: String(body.anthemTitle || "").trim(),
      anthemText: String(body.anthemText || "").trim(),

      ctaTitle: String(body.ctaTitle || "").trim(),
      ctaDescription: String(body.ctaDescription || "").trim(),
      ctaPrimaryText: String(body.ctaPrimaryText || "").trim(),
      ctaPrimaryLink: String(body.ctaPrimaryLink || "").trim(),
      ctaSecondaryText: String(body.ctaSecondaryText || "").trim(),
      ctaSecondaryLink: String(body.ctaSecondaryLink || "").trim(),
    };

    const settings = await prisma.aboutSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT about settings error:", error);

    return NextResponse.json(
      { message: "Unable to save About settings." },
      { status: 500 }
    );
  }
}
