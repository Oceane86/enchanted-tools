import type { NextConfig } from "next";
import createNextPWA from "@ducanh2912/next-pwa";

const withPWA = createNextPWA({
  dest: "public",
  register: true,
  // disable en dev si tu veux
  // disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // tes autres options Next ici si besoin
};

export default withPWA(nextConfig);