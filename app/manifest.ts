import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Club Tracker",
    short_name: "Club Tracker",
    description:
      "Track Baruch and Macaulay clubs, applications, deadlines, and events.",

    start_url: "/",
    display: "standalone",

    background_color: "#09090b",
    theme_color: "#09090b",

    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}