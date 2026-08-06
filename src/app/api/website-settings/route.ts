import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.websiteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET website settings error:", error);

    return NextResponse.json(
      { message: "Unable to load website settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const settings = await prisma.websiteSettings.upsert({
      where: { id: 1 },
      update: {
        schoolName: body.schoolName,
        shortName: body.shortName,
        tagline: body.tagline,
        motto: body.motto,
        vision: body.vision,
        mission: body.mission,
        coreValues: body.coreValues,
        introductionTitle: body.introductionTitle,
        introductionText: body.introductionText,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        centreCode: body.centreCode,
        admissionsText: body.admissionsText,
        admissionsLink: body.admissionsLink,
        whatsappNumber: body.whatsappNumber,
        phone: body.phone,
        email: body.email,
        location: body.location,
        mapUrl: body.mapUrl,
        introductionImage: body.introductionImage,
        introductionMediaType: body.introductionMediaType,
      },
      create: {
        id: 1,
        schoolName: body.schoolName,
        shortName: body.shortName,
        tagline: body.tagline,
        motto: body.motto,
        vision: body.vision,
        mission: body.mission,
        coreValues: body.coreValues,
        introductionTitle: body.introductionTitle,
        introductionText: body.introductionText,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        centreCode: body.centreCode,
        admissionsText: body.admissionsText,
        admissionsLink: body.admissionsLink,
        whatsappNumber: body.whatsappNumber,
        phone: body.phone,
        email: body.email,
        location: body.location,
        mapUrl: body.mapUrl,
        introductionImage: body.introductionImage,
        introductionMediaType: body.introductionMediaType,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT website settings error:", error);

    return NextResponse.json(
      { message: "Unable to update website settings." },
      { status: 500 }
    );
  }
}
