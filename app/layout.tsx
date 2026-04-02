import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Houston Studio | Estudio de Grabación Profesional en Asunción, Paraguay",
  description:
    "Estudio de grabación con 14 años de experiencia en locución, doblaje, spots de radio y TV, IVR y jingles. Producción de audio profesional para marcas en Asunción, Paraguay.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://houstonstudio.com.py"),
  openGraph: {
    title: "Houston Studio | Estudio de Grabación Profesional",
    description:
      "Producción de audio profesional con 14 años de experiencia. Locución, doblaje, spots de radio y TV, IVR y jingles desde Asunción, Paraguay.",
    url: "/",
    siteName: "Houston Studio",
    locale: "es_PY",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Houston Studio - Estudio de Grabación Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Studio | Estudio de Grabación Profesional",
    description:
      "Producción de audio profesional desde Asunción, Paraguay. 14 años de experiencia.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Houston Studio",
    description:
      "Estudio de grabación profesional con 14 años de experiencia en locución, doblaje, spots de radio y TV, IVR y jingles.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://houstonstudio.com.py",
    telephone: "+595-XXX-XXXXXX",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Asunción",
      addressCountry: "PY",
    },
    serviceArea: {
      "@type": "Place",
      name: "Paraguay",
    },
    additionalType: "https://schema.org/ProfessionalService",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Producción de Audio",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Locución profesional" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Spots de radio y TV" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Doblaje" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "IVR y audio corporativo" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Jingles y música" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Redacción creativa" } },
      ],
    },
  };

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
