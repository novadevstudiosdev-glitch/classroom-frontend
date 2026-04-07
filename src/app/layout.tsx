import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import "@/styles/theme.css";
import "@/styles/home-view.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  display: "swap",
  variable: "--font-main",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteDescription =
  "Misiones, recompensas y aventuras espaciales para chicos de 6 a 12 años. Aprendé matemática, lengua y ciencias sin aburrirte.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Novi",
    template: "%s | Novi",
  },
  description: siteDescription,
  applicationName: "Novi",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Novi",
    "aprendizaje",
    "educación",
    "misiones educativas",
    "matemática",
    "lengua",
    "ciencias",
    "estudiantes",
    "docentes",
    "familias",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    title: "Novi",
    description: siteDescription,
    siteName: "Novi",
    images: [
      {
        url: "/NOVI.png",
        width: 1200,
        height: 630,
        alt: "Novi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Novi",
    description: siteDescription,
    images: ["/NOVI.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/NOVI.png" }],
    shortcut: ["/NOVI.png"],
    apple: [{ url: "/NOVI.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#07061a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} h-full antialiased`}
      style={{ backgroundColor: "#07061a" }}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#07061a", color: "#ffffff" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
