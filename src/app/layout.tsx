import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Sans_KR } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { AdminThemeProvider } from "@/components/admin/ThemeProvider";
import { SITE, getSiteUrl } from "@/lib/site";
import { CHURCH } from "../../church.config";
import "./globals.css";

const gmarketSans = localFont({
  src: [
    {
      path: "../../public/fonts/gmarket-sans/GmarketSansMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/gmarket-sans/GmarketSansBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-gmarket-sans",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const siteUrl = getSiteUrl();
const titleDefault = CHURCH.denomination
  ? `${CHURCH.name} | ${CHURCH.denomination}`
  : CHURCH.name;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleDefault,
    template: `%s | ${CHURCH.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...CHURCH.seo.keywords],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed/sermons.xml", title: `${SITE.name} 주일설교` },
        { url: "/feed/notices.xml", title: `${SITE.name} 교회소식` },
        { url: "/feed/columns.xml", title: `${SITE.name} 목양칼럼` },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: SITE.name,
    title: titleDefault,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: titleDefault,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  verification: {
    ...(CHURCH.seo.googleVerification
      ? { google: CHURCH.seo.googleVerification }
      : {}),
    ...(CHURCH.seo.naverVerification
      ? {
          other: {
            "naver-site-verification": CHURCH.seo.naverVerification,
          },
        }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${gmarketSans.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-charcoal text-base font-sans">
        <AdminThemeProvider>
          {children}
          <OrganizationJsonLd />
          <Toaster richColors position="top-center" />
        </AdminThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
