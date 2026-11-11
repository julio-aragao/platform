import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const plexSans = localFont({
  variable: "--font-plex-sans",
  display: "swap",
  src: [
    { path: "../fonts/IBMPlexSans-Regular.ttf", weight: "400" },
    { path: "../fonts/IBMPlexSans-Medium.ttf", weight: "500" },
    { path: "../fonts/IBMPlexSans-SemiBold.ttf", weight: "600" },
    { path: "../fonts/IBMPlexSans-Bold.ttf", weight: "700" },
  ],
});

const plexMono = localFont({
  variable: "--font-plex-mono",
  display: "swap",
  src: [
    { path: "../fonts/IBMPlexMono-Regular.ttf", weight: "400" },
    { path: "../fonts/IBMPlexMono-Medium.ttf", weight: "500" },
  ],
});

export const metadata: Metadata = {
  title: { default: "Aurora", template: "%s · Aurora" },
  description: "Plataforma da Aurora Tecnologias para os dados e documentos das suas usinas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
