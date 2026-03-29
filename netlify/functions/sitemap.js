// Sitemap dynamique — aucune dépendance externe requise
// Ajoute tes pages dans le tableau ci-dessous

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
  // ← Ajoute ici tes autres épisodes/pages
];

const generateSitemap = () => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  pages.forEach(p => {
    xml += `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
  });
  xml += `</urlset>`;
  return xml;
};

exports.handler = async () => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600, must-revalidate"
  },
  body: generateSitemap()
});
