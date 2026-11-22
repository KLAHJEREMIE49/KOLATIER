/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Toutes les images et vidéos sont servies depuis /public : aucune requête réseau externe,
  // aucun remotePattern. Le site fonctionne hors ligne pour les médias.
  images: {
    formats: ['image/webp'],
  },
};

export default nextConfig;
