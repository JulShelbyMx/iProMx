const { builder } = require("@netlify/functions");

// === Liste de toutes tes pages (à compléter au fur et à mesure) ===
const pages = [
  {
    loc: "https://ipromx.netlify.app/",
    lastmod: "2026-03-29",
    changefreq: "weekly",
    priority: "1.0"
  },
  {
    loc: "https://ipromx.netlify.app/flash/david/saison-1/ep1",
    lastmod: "2026-03-29",
    changefreq: "monthly",
    priority: "0.8"
  },
  // ← Ajoute ici tous tes autres épisodes, pages, saisons...
];

const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  pages.forEach(page => {
    xml += `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
};

exports.handler = builder(async () => {
  const sitemapXml = generateSitemap();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate"  // 1 heure de cache
    },
    body: sitemapXml
  };
});