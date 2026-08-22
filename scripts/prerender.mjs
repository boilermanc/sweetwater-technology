import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();
const outputDirectory = path.join(projectRoot, 'dist');
const serverEntry = path.join(projectRoot, 'node_modules', '.tmp', 'sweetwater-prerender', 'entry-server.js');
const template = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
const { prerenderRoutes, render, sitemapEntries } = await import(pathToFileURL(serverEntry).href);

for (const route of prerenderRoutes) {
  const { appHtml, headHtml } = render(route);
  const html = template
    .replace('<!--app-head-->', headHtml)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  const routeDirectory = route === '/'
    ? outputDirectory
    : path.join(outputDirectory, ...route.slice(1).split('/'));

  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, 'index.html'), html);
  if (route === '/404') {
    await writeFile(path.join(outputDirectory, '404.html'), html);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map((entry) => `  <url>
    <loc>https://sweetwater.technology${entry.path === '/' ? '/' : entry.path}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(outputDirectory, 'sitemap.xml'), sitemap);

console.log(`Prerendered ${prerenderRoutes.length} routes: ${prerenderRoutes.join(', ')}`);
