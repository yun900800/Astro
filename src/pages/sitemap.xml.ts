import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const siteUrl = "https://innovation.pp.ua/";

	const posts = await getCollection("post");
	const notes = await getCollection("note");

	const staticUrls = `
	<url>
		<loc>${siteUrl}</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>${siteUrl}posts/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>${siteUrl}notes/</loc>
		<changefreq>weekly</changefreq>
		<priority>0.7</priority>
	</url>
	<url>
		<loc>${siteUrl}about/</loc>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>
	<url>
		<loc>${siteUrl}tags/</loc>
		<changefreq>weekly</changefreq>
		<priority>0.5</priority>
	</url>`;

	const postUrls = posts
		.filter((post) => !post.data.draft)
		.map((post) => {
			const slug = post.id.replace(/\.(md|mdx)$/, "");
			const lastmod = (post.data.updatedDate ?? post.data.publishDate).toISOString().split("T")[0];
			return `
	<url>
		<loc>${siteUrl}posts/${slug}/</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>`;
		})
		.join("");

	const noteUrls = notes
		.map((note) => {
			const slug = note.id.replace(/\.(md|mdx)$/, "");
			const lastmod = note.data.publishDate.toISOString().split("T")[0];
			return `
	<url>
		<loc>${siteUrl}notes/${slug}/</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>`;
		})
		.join("");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}${postUrls}${noteUrls}
</urlset>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
