import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

type NavItem = {
  label: string;
  href: string;
};

function safeParse(value: string): NavItem[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const defaults = {
  id: 1,

  badgeUrl: "/branding/school-badge.png",
  badgeAlt: "St. Mary's Secondary School Manja badge",
  headerLocationLabel: "Manja",

  homeLabel: "Home",
  aboutLabel: "About",
  academicsLabel: "Academics",
  studentLifeLabel: "Student Life",
  mediaLabel: "Media",
  admissionsLabel: "Admissions",
  contactLabel: "Contact",

  topAdmissionsText: "Online Admissions",
  topAdmissionsLink: "/admissions",

  aboutMenuTitle: "Discover St. Mary's",
  aboutMenuSubtitle:
    "Our identity, history, values and leadership.",

  aboutLinks: JSON.stringify([
    { label: "About Our School", href: "/about" },
    {
      label: "Mission, Vision & Motto",
      href: "/about#mission",
    },
    { label: "Leadership", href: "/#leadership" },
    {
      label: "Board of Governors",
      href: "/about#governance",
    },
    { label: "School Anthem", href: "/about#anthem" },
  ]),

  academicsMenuTitle: "Academic Programmes",
  academicsMenuSubtitle:
    "Quality O-Level and A-Level education.",

  academicsLinks: JSON.stringify([
    { label: "Academics Overview", href: "/academics" },
    {
      label: "O-Level Programme",
      href: "/academics#o-level",
    },
    {
      label: "A-Level Programme",
      href: "/academics#a-level",
    },
    {
      label: "Departments",
      href: "/academics#departments",
    },
    {
      label: "Subjects Offered",
      href: "/academics#subjects",
    },
    {
      label: "Academic Performance",
      href: "/academics#performance",
    },
  ]),

  studentLifeMenuTitle: "Life Beyond the Classroom",
  studentLifeMenuSubtitle:
    "Talent, leadership and holistic development.",

  studentLifeLinks: JSON.stringify([
    {
      label: "Academic Life",
      href: "/academics#co-curricular",
    },
    {
      label: "Clubs & Societies",
      href: "/academics#co-curricular",
    },
    {
      label: "Sports",
      href: "/academics#co-curricular",
    },
    {
      label: "Music, Dance & Drama",
      href: "/academics#co-curricular",
    },
    {
      label: "Agriculture",
      href: "/academics#co-curricular",
    },
    {
      label: "School Calendar",
      href: "/academics#calendar",
    },
  ]),

  mediaLinks: JSON.stringify([
    { label: "Latest News", href: "/news" },
    { label: "Photo Gallery", href: "/gallery" },
    {
      label: "School Calendar",
      href: "/academics#calendar",
    },
  ]),

  footerDescription:
    "Nurturing disciplined, responsible and academically excellent learners.",

  footerQuickTitle: "Quick Links",

  footerQuickLinks: JSON.stringify([
    { label: "About Us", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Admissions", href: "/admissions" },
    { label: "Contact", href: "/contact" },
  ]),

  footerMediaTitle: "Media",

  footerMediaLinks: JSON.stringify([
    { label: "Latest News", href: "/news" },
    { label: "Gallery", href: "/gallery" },
    {
      label: "Academic Life",
      href: "/academics#co-curricular",
    },
    {
      label: "School Calendar",
      href: "/academics#calendar",
    },
  ]),

  footerContactTitle: "Contact",
  footerCopyrightText: "All rights reserved.",
};

export async function GET() {
  try {
    const settings = await prisma.globalLayoutSettings.upsert({
      where: { id: 1 },
      update: {},
      create: defaults,
    });

    return NextResponse.json({
      ...settings,
      aboutLinks: safeParse(settings.aboutLinks),
      academicsLinks: safeParse(settings.academicsLinks),
      studentLifeLinks: safeParse(settings.studentLifeLinks),
      mediaLinks: safeParse(settings.mediaLinks),
      footerQuickLinks: safeParse(settings.footerQuickLinks),
      footerMediaLinks: safeParse(settings.footerMediaLinks),
    });
  } catch (error) {
    console.error("GET global layout settings error:", error);

    return NextResponse.json(
      { message: "Unable to load global layout settings." },
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
      badgeUrl: String(body.badgeUrl || "").trim(),
      badgeAlt: String(body.badgeAlt || "").trim(),
      headerLocationLabel: String(
        body.headerLocationLabel || ""
      ).trim(),

      homeLabel: String(body.homeLabel || "").trim(),
      aboutLabel: String(body.aboutLabel || "").trim(),
      academicsLabel: String(
        body.academicsLabel || ""
      ).trim(),
      studentLifeLabel: String(
        body.studentLifeLabel || ""
      ).trim(),
      mediaLabel: String(body.mediaLabel || "").trim(),
      admissionsLabel: String(
        body.admissionsLabel || ""
      ).trim(),
      contactLabel: String(body.contactLabel || "").trim(),

      topAdmissionsText: String(
        body.topAdmissionsText || ""
      ).trim(),

      topAdmissionsLink: String(
        body.topAdmissionsLink || ""
      ).trim(),

      aboutMenuTitle: String(
        body.aboutMenuTitle || ""
      ).trim(),

      aboutMenuSubtitle: String(
        body.aboutMenuSubtitle || ""
      ).trim(),

      aboutLinks: JSON.stringify(
        Array.isArray(body.aboutLinks)
          ? body.aboutLinks
          : []
      ),

      academicsMenuTitle: String(
        body.academicsMenuTitle || ""
      ).trim(),

      academicsMenuSubtitle: String(
        body.academicsMenuSubtitle || ""
      ).trim(),

      academicsLinks: JSON.stringify(
        Array.isArray(body.academicsLinks)
          ? body.academicsLinks
          : []
      ),

      studentLifeMenuTitle: String(
        body.studentLifeMenuTitle || ""
      ).trim(),

      studentLifeMenuSubtitle: String(
        body.studentLifeMenuSubtitle || ""
      ).trim(),

      studentLifeLinks: JSON.stringify(
        Array.isArray(body.studentLifeLinks)
          ? body.studentLifeLinks
          : []
      ),

      mediaLinks: JSON.stringify(
        Array.isArray(body.mediaLinks)
          ? body.mediaLinks
          : []
      ),

      footerDescription: String(
        body.footerDescription || ""
      ).trim(),

      footerQuickTitle: String(
        body.footerQuickTitle || ""
      ).trim(),

      footerQuickLinks: JSON.stringify(
        Array.isArray(body.footerQuickLinks)
          ? body.footerQuickLinks
          : []
      ),

      footerMediaTitle: String(
        body.footerMediaTitle || ""
      ).trim(),

      footerMediaLinks: JSON.stringify(
        Array.isArray(body.footerMediaLinks)
          ? body.footerMediaLinks
          : []
      ),

      footerContactTitle: String(
        body.footerContactTitle || ""
      ).trim(),

      footerCopyrightText: String(
        body.footerCopyrightText || ""
      ).trim(),
    };

    const settings = await prisma.globalLayoutSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    return NextResponse.json({
      ...settings,
      aboutLinks: safeParse(settings.aboutLinks),
      academicsLinks: safeParse(settings.academicsLinks),
      studentLifeLinks: safeParse(settings.studentLifeLinks),
      mediaLinks: safeParse(settings.mediaLinks),
      footerQuickLinks: safeParse(settings.footerQuickLinks),
      footerMediaLinks: safeParse(settings.footerMediaLinks),
    });
  } catch (error) {
    console.error("PUT global layout settings error:", error);

    return NextResponse.json(
      { message: "Unable to save global layout settings." },
      { status: 500 }
    );
  }
}
