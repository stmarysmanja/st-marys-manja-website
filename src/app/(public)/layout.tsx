import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

export const dynamic = "force-dynamic";

type NavItem = {
  label: string;
  href: string;
};

function parseList(
  value: string | null | undefined
): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseLinks(
  value: string | null | undefined
): NavItem[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => ({
        label: String(item?.label || "").trim(),
        href: String(item?.href || "").trim(),
      }))
      .filter(
        (item) => item.label && item.href
      );
  } catch {
    return [];
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    websiteSettings,
    contactSettings,
    globalSettings,
  ] = await Promise.all([
    prisma.websiteSettings.findUnique({
      where: { id: 1 },
    }),

    prisma.contactSettings.findUnique({
      where: { id: 1 },
    }),

    prisma.globalLayoutSettings.findUnique({
      where: { id: 1 },
    }),
  ]);

  const phones = parseList(
    contactSettings?.phones
  );

  const emails = parseList(
    contactSettings?.emails
  );

  const schoolName =
    websiteSettings?.schoolName?.trim() ||
    "St Mary's Secondary School-Manja";

  const phone =
    phones[0]?.trim() ||
    "+256 703 521 380";

  const email =
    emails[0]?.trim() ||
    "stmarysmanjasecondaryschool2@gmail.com";

  const location =
    contactSettings?.location?.trim() ||
    "Manja, Uganda";

  const badgeUrl =
    globalSettings?.badgeUrl ||
    "/branding/school-badge.png";

  const badgeAlt =
    globalSettings?.badgeAlt ||
    "St. Mary's Secondary School Manja badge";

  const aboutLinks = parseLinks(
    globalSettings?.aboutLinks
  );

  const academicsLinks = parseLinks(
    globalSettings?.academicsLinks
  );

  const studentLifeLinks = parseLinks(
    globalSettings?.studentLifeLinks
  );

  const mediaLinks = parseLinks(
    globalSettings?.mediaLinks
  );

  const footerQuickLinks = parseLinks(
    globalSettings?.footerQuickLinks
  );

  const footerMediaLinks = parseLinks(
    globalSettings?.footerMediaLinks
  );

  return (
    <>
      <PublicHeader
        schoolName={schoolName}
        phone={phone}
        email={email}

        badgeUrl={badgeUrl}
        badgeAlt={badgeAlt}
        headerLocationLabel={
          globalSettings?.headerLocationLabel ||
          "Manja"
        }

        homeLabel={
          globalSettings?.homeLabel ||
          "Home"
        }

        aboutLabel={
          globalSettings?.aboutLabel ||
          "About"
        }

        academicsLabel={
          globalSettings?.academicsLabel ||
          "Academics"
        }

        studentLifeLabel={
          globalSettings?.studentLifeLabel ||
          "Student Life"
        }

        mediaLabel={
          globalSettings?.mediaLabel ||
          "Media"
        }

        admissionsLabel={
          globalSettings?.admissionsLabel ||
          "Admissions"
        }

        contactLabel={
          globalSettings?.contactLabel ||
          "Contact"
        }

        topAdmissionsText={
          globalSettings?.topAdmissionsText ||
          "Online Admissions"
        }

        topAdmissionsLink={
          globalSettings?.topAdmissionsLink ||
          "/admissions"
        }

        aboutMenuTitle={
          globalSettings?.aboutMenuTitle ||
          "Discover St. Mary's"
        }

        aboutMenuSubtitle={
          globalSettings?.aboutMenuSubtitle ||
          "Our identity, history, values and leadership."
        }

        aboutLinks={aboutLinks}

        academicsMenuTitle={
          globalSettings?.academicsMenuTitle ||
          "Academic Programmes"
        }

        academicsMenuSubtitle={
          globalSettings?.academicsMenuSubtitle ||
          "Quality O-Level and A-Level education."
        }

        academicsLinks={academicsLinks}

        studentLifeMenuTitle={
          globalSettings?.studentLifeMenuTitle ||
          "Life Beyond the Classroom"
        }

        studentLifeMenuSubtitle={
          globalSettings?.studentLifeMenuSubtitle ||
          "Talent, leadership and holistic development."
        }

        studentLifeLinks={studentLifeLinks}
        mediaLinks={mediaLinks}
      />

      <main>{children}</main>

      <PublicFooter
        schoolName={schoolName}
        location={location}
        phone={phone}
        email={email}

        badgeUrl={badgeUrl}
        badgeAlt={badgeAlt}

        footerDescription={
          globalSettings?.footerDescription ||
          "Nurturing disciplined, responsible and academically excellent learners."
        }

        footerQuickTitle={
          globalSettings?.footerQuickTitle ||
          "Quick Links"
        }

        footerQuickLinks={footerQuickLinks}

        footerMediaTitle={
          globalSettings?.footerMediaTitle ||
          "Media"
        }

        footerMediaLinks={footerMediaLinks}

        footerContactTitle={
          globalSettings?.footerContactTitle ||
          "Contact"
        }

        footerCopyrightText={
          globalSettings?.footerCopyrightText ||
          "All rights reserved."
        }
      />
    </>
  );
}
