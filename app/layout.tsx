import type {
  Metadata,
  Viewport,
} from "next";

import PwaRegister from "@/components/pwa-register";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Club Tracker",
    template: "%s | Club Tracker",
  },

  description:
    "Track Baruch and Macaulay clubs, applications, deadlines, and events.",

  applicationName:
    "Club Tracker",

  manifest:
    "/manifest.webmanifest",

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },

  appleWebApp: {
    capable: true,
    title: "Club Tracker",
    statusBarStyle:
      "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",

  themeColor:
    "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">
        <PwaRegister />

        {children}
      </body>
    </html>
  );
}