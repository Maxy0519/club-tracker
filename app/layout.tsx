import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Club Tracker",
  description:
    "Baruch and Macaulay club management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}