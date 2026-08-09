import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

export const dynamic = "force-dynamic";

function parseList(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [websiteSettings, contactSettings] = await Promise.all([
    prisma.websiteSettings.findUnique({
      where: { id: 1 },
    }),
    prisma.contactSettings.findUnique({
      where: { id: 1 },
    }),
  ]);

  const phones = parseList(contactSettings?.phones);
  const emails = parseList(contactSettings?.emails);

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

  return (
    <>
      <PublicHeader
        schoolName={schoolName}
        phone={phone}
        email={email}
      />

      <main>{children}</main>

      <PublicFooter
        schoolName={schoolName}
        location={location}
        phone={phone}
        email={email}
      />
    </>
  );
}
