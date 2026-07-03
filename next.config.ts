import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan baris ini di dalam objek config kamu:
  allowedDevOrigins: ['192.168.100.56'],
};

export default nextConfig;
