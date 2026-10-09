/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    // Evita o aviso do Next para imagens com quality={100}
    qualities: [75, 100],
  },
}

export default nextConfig
