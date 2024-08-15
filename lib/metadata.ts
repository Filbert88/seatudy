import { type Metadata } from "next";

export const openGraphTemplate: Metadata["openGraph"] = {
  description:
    "Seatudy is a cutting-edge online learning platform designed to empower individuals to acquire new skills and achieve their professional goals.",
  url: "https://seatudy-real.vercel.app/",
  siteName: "Seatudy",
  locale: "en-US",
  type: "website",
  images: {
    url: "https://seatudy-real.vercel.app/assets/seatudy-logo.png",
    width: "232",
    height: "272",
    alt: "Seatudy Logo",
  },
};

export const twitterTemplate: Metadata["twitter"] = {
  card: "summary_large_image",
  description:
    "Seatudy is a cutting-edge online learning platform designed to empower individuals to acquire new skills and achieve their professional goals.",
  site: "@Seatudy",
  images: {
    url: "https://seatudy-real.vercel.app/assets/seatudy-logo.png",
    alt: "Seatudy Logo",
  },
};
