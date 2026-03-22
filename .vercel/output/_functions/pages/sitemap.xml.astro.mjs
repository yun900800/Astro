import { g as getCollection } from '../chunks/_astro_content_BYQmFWJo.mjs';
import { a as getAllPosts } from '../chunks/post_B702iK3C.mjs';
export { renderers } from '../renderers.mjs';

const GET = async () => {
  const siteUrl = "https://innovation.pp.ua/";
  const posts = await getAllPosts();
  const notes = await getCollection("note");
  const postUrls = posts.map((post) => {
    const slug = post.id.replace(/\.(md|mdx)$/, "");
    return `
		<url>
			<loc>${siteUrl}posts/${slug}/</loc>
			<lastmod>${(post.data.updatedDate ?? post.data.publishDate).toISOString().split("T")[0]}</lastmod>
			<changefreq>weekly</changefreq>
			<priority>0.8</priority>
		</url>`;
  });
  const noteUrls = notes.map((note) => {
    const slug = note.id.replace(/\.(md|mdx)$/, "");
    return `
		<url>
			<loc>${siteUrl}notes/${slug}/</loc>
			<lastmod>${note.data.publishDate.toISOString().split("T")[0]}</lastmod>
			<changefreq>monthly</changefreq>
			<priority>0.6</priority>
		</url>`;
  });
  const staticPages = [
    { url: siteUrl, priority: "1.0", changefreq: "daily" },
    { url: `${siteUrl}posts/`, priority: "1.0", changefreq: "daily" },
    { url: `${siteUrl}notes/`, priority: "0.7", changefreq: "weekly" },
    { url: `${siteUrl}about/`, priority: "0.6", changefreq: "monthly" },
    { url: `${siteUrl}tags/`, priority: "0.5", changefreq: "weekly" }
  ];
  const staticUrls = staticPages.map(
    (page) => `
		<url>
			<loc>${page.url}</loc>
			<changefreq>${page.changefreq}</changefreq>
			<priority>${page.priority}</priority>
		</url>`
  ).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${staticUrls}
	${postUrls.join("")}
	${noteUrls.join("")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
