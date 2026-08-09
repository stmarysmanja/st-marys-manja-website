import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  try {
    const settings = await prisma.contactSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        location: "Manja, Uganda",
        phones: JSON.stringify(["+256 700 240 640"]),
        emails: JSON.stringify(["stmarysmanjasecondaryschool2@gmail.com"]),
        weekdays: "Monday â€“ Friday: 8:00 AM â€“ 5:00 PM",
        saturday: "Saturday: 9:00 AM â€“ 1:00 PM",
        sunday: "Sunday: Closed",
        visitText:
          "We warmly welcome prospective parents and students to visit our school. Please contact the Admissions Office in advance to schedule a tour.",
        directionsText:
          "St. Mary's Secondary School â€“ Manja is easily accessible from the main road. Contact the school office for detailed directions.",
        whatsappNumber: "256700240640",
        mapUrl:
          "https://maps.google.com/maps?q=Manja%20Secondary%20School%20Uganda&t=&z=13&ie=UTF8&iwloc=&output=embed",
      },
    });

    return NextResponse.json({
      ...settings,
      phones: JSON.parse(settings.phones),
      emails: JSON.parse(settings.emails),
    });
  } catch (error) {
    console.error("GET contact settings error:", error);

    return NextResponse.json(
      { message: "Unable to load contact settings." },
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

    const settings = await prisma.contactSettings.upsert({
      where: { id: 1 },
      update: {
        location: String(body.location || "").trim(),
        phones: JSON.stringify(Array.isArray(body.phones) ? body.phones : []),
        emails: JSON.stringify(Array.isArray(body.emails) ? body.emails : []),
        weekdays: String(body.weekdays || "").trim(),
        saturday: String(body.saturday || "").trim(),
        sunday: String(body.sunday || "").trim(),
        visitText: String(body.visitText || "").trim(),
        directionsText: String(body.directionsText || "").trim(),
        whatsappNumber: String(body.whatsappNumber || "").trim(),
        mapUrl: String(body.mapUrl || "").trim(),
      },
      create: {
        id: 1,
        location: String(body.location || "").trim(),
        phones: JSON.stringify(Array.isArray(body.phones) ? body.phones : []),
        emails: JSON.stringify(Array.isArray(body.emails) ? body.emails : []),
        weekdays: String(body.weekdays || "").trim(),
        saturday: String(body.saturday || "").trim(),
        sunday: String(body.sunday || "").trim(),
        visitText: String(body.visitText || "").trim(),
        directionsText: String(body.directionsText || "").trim(),
        whatsappNumber: String(body.whatsappNumber || "").trim(),
        mapUrl: String(body.mapUrl || "").trim(),
      },
    });

    return NextResponse.json({
      ...settings,
      phones: JSON.parse(settings.phones),
      emails: JSON.parse(settings.emails),
    });
  } catch (error) {
    console.error("PUT contact settings error:", error);

    return NextResponse.json(
      { message: "Unable to save contact settings." },
      { status: 500 }
    );
  }
}
