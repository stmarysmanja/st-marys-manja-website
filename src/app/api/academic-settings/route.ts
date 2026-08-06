import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  try {
    const settings = await prisma.academicSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        heroTitle: "Academic Curriculum",
        heroSubtitle:
          "Equipping learners with knowledge, skills and values for a successful future.",
        heroMediaUrl: "/Filed work.jpg",
        heroMediaType: "image",
        oLevelTitle: "Lower Secondary (O-Level / UCE)",
        oLevelDescription:
          "Following the competence-based curriculum focusing on practical knowledge and learner-centred assessment.",
        oLevelItems:
          "Mathematics & English Language\nBiology, Chemistry & Physics\nGeography, History & Religious Education\nEntrepreneurship Education\nICT & Agriculture",
        aLevelTitle: "Upper Secondary (A-Level / UACE)",
        aLevelDescription:
          "Specialized Arts and Sciences combinations designed to prepare students for university degrees and professional careers.",
        aLevelSciences: "PCM, PCB, BCM, MEG",
        aLevelArts: "HEG, LEG, DEG, HEA",
        aLevelSubsidiaries: "Sub-Math / ICT & General Paper",
        departmentsText:
          "Our departments provide expert guidance and quality teaching across all subject areas.",
        subjectsText:
          "A wide range of subjects at O-Level and A-Level to match students' interests and career goals.",
        performanceText:
          "We celebrate excellence and continuous improvement in academic achievement.",
        calendarText:
          "Stay informed about terms, examinations, holidays and important academic events.",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET academic settings error:", error);

    return NextResponse.json(
      { message: "Unable to load academic settings." },
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
      heroMediaUrl: String(body.heroMediaUrl || "").trim(),
      heroMediaType: body.heroMediaType === "video" ? "video" : "image",
      oLevelTitle: String(body.oLevelTitle || "").trim(),
      oLevelDescription: String(body.oLevelDescription || "").trim(),
      oLevelItems: String(body.oLevelItems || "").trim(),
      aLevelTitle: String(body.aLevelTitle || "").trim(),
      aLevelDescription: String(body.aLevelDescription || "").trim(),
      aLevelSciences: String(body.aLevelSciences || "").trim(),
      aLevelArts: String(body.aLevelArts || "").trim(),
      aLevelSubsidiaries: String(body.aLevelSubsidiaries || "").trim(),
      departmentsText: String(body.departmentsText || "").trim(),
      subjectsText: String(body.subjectsText || "").trim(),
      performanceText: String(body.performanceText || "").trim(),
      calendarText: String(body.calendarText || "").trim(),
    };

    const settings = await prisma.academicSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT academic settings error:", error);

    return NextResponse.json(
      { message: "Unable to save academic settings." },
      { status: 500 }
    );
  }
}
