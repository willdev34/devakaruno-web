/** @type {import('next').NextConfig} */

// Cabeçalhos de segurança aplicados a todas as páginas (sem CSP, que exigiria listar cada script de terceiros)
export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Imagens e ícones do site não mudam de nome: cache de um dia, com revalidação em segundo plano por uma semana
export const staticAssetHeaders = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
];

const nextConfig = {
  // Não informa a tecnologia do servidor
  poweredByHeader: false,
  images: {
    unoptimized: true,
    // Evita o aviso do Next para imagens com quality={100}
    qualities: [75, 100],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: staticAssetHeaders },
    ];
  },
};

export default nextConfig;
