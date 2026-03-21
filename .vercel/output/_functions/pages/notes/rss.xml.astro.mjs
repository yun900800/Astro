import { g as getCollection } from '../../chunks/_astro_content_CeIVgrIS.mjs';
import { s as siteConfig } from '../../chunks/site.config_DgxvfQdl.mjs';
import rss from '@astrojs/rss';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  const notes = await getCollection("note");
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: "https://innovation.pp.ua/",
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.publishDate,
      link: `notes/${note.id}/`
    }))
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
