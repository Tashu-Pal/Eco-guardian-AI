import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoGuardian AI — Civic & Environmental Intelligence",
  description:
    "Citizens report photos. AI classifies severity. Cities route Air, Water, Waste, and Heat in one live operations board.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=Source+Serif+4:opsz,wght@8..60,500;8..60,650&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grid-bg antialiased">{children}</body>
    </html>
  );
}
