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
    websiteSettings?.schoolName || "St Mary's Secondary School-Manja";

  const phone =
    phones[0] || "+256 700 240 640";

  const email =
    emails[0] || "info@stmarysmanja.sc.ug";

  const location =
    contactSettings?.location || "Manja, Uganda";

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
