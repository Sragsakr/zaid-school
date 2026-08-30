import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مجمع مدارس الشيخ زايد الرسمية لغات",
    short_name: "موقع المدرسة",
    description: "البوابة الرسمية لأخبار وإعلانات وفعاليات المدرسة",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#f7f8f5",
    theme_color: "#14213d",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}