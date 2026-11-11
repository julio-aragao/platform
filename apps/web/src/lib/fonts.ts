import localFont from "next/font/local";

export const plexSans = localFont({
  variable: "--font-plex-sans",
  display: "swap",
  src: [
    { path: "../fonts/IBMPlexSans-Regular.ttf", weight: "400" },
    { path: "../fonts/IBMPlexSans-Medium.ttf", weight: "500" },
    { path: "../fonts/IBMPlexSans-SemiBold.ttf", weight: "600" },
    { path: "../fonts/IBMPlexSans-Bold.ttf", weight: "700" },
  ],
});

export const plexMono = localFont({
  variable: "--font-plex-mono",
  display: "swap",
  src: [
    { path: "../fonts/IBMPlexMono-Regular.ttf", weight: "400" },
    { path: "../fonts/IBMPlexMono-Medium.ttf", weight: "500" },
  ],
});
