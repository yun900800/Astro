import fs from "node:fs";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import { defineConfig, envField } from "astro/config";
import { expressiveCodeOptions, siteConfig } from "./src/site.config";

// Remark plugins
import remarkDirective from "remark-directive";
import remarkGemoji from "remark-gemoji";
import remarkMath from "remark-math";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions";
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// Rehype plugins
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeUnwrapImages from "rehype-unwrap-images";

import decapCmsOauth from "astro-decap-cms-oauth";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: vercel(),
	image: {
		domains: ["webmention.io"],
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		icon({
			iconDir: "public/icons",
		}),
		tailwind({
			applyBaseStyles: false,
			nesting: true,
		}),
		mdx(),
		robotsTxt({
			sitemap: ["https://www.innovation.pp.ua/sitemap.xml"],
		}),
		webmanifest({
			name: siteConfig.title,
			short_name: "仙人掌主题",
			description: siteConfig.description,
			lang: siteConfig.lang,
			icon: "public/icon.svg",
			icons: [
				{
					src: "icons/apple-touch-icon.png",
					sizes: "180x180",
					type: "image/png",
				},
				{
					src: "icons/icon-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "icons/icon-512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			start_url: "/",
			background_color: "#1d1f21",
			theme_color: "#2bbc8a",
			display: "standalone",
			config: {
				insertFaviconLinks: false,
				insertThemeColorMeta: false,
				insertManifestLink: false,
			},
		}),
		decapCmsOauth(),
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ["nofollow, noreferrer"],
					target: "_blank",
				},
			],
			rehypeUnwrapImages,
			rehypeKatex,
		],
		remarkPlugins: [
			remarkReadingTime,
			remarkDirective,
			remarkAdmonitions,
			remarkMath,
			remarkGemoji,
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
			footnoteLabel: "脚注：",
		},
	},
	prefetch: {
		defaultStrategy: "viewport",
		prefetchAll: true,
	},
	site: "https://innovation.pp.ua/",
	vite: {
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		plugins: [rawFonts([".ttf", ".woff"])],
	},
	env: {
		schema: {
			WEBMENTION_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
			WEBMENTION_URL: envField.string({ context: "client", access: "public", optional: true }),
			WEBMENTION_PINGBACK: envField.string({ context: "client", access: "public", optional: true }),
		},
	},
});

function rawFonts(ext: string[]) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-expect-error:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
