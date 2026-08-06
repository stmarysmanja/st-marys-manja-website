import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "St. Mary's Secondary School – Manja",
    template: "%s | St. Mary's Secondary School – Manja",
  },
  description:
    "Official website of St. Mary's Secondary School – Manja.",
  icons: {
    icon: "/branding/school-badge.png",
    shortcut: "/branding/school-badge.png",
    apple: "/branding/school-badge.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
