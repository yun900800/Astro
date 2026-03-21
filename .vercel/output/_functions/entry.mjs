import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_iXikKQxh.mjs';
import { manifest } from './manifest_DBrVpY8X.mjs';

const serverIslandMap = new Map([
]);;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/disclaimer.astro.mjs');
const _page6 = () => import('./pages/notes/rss.xml.astro.mjs');
const _page7 = () => import('./pages/notes/_---page_.astro.mjs');
const _page8 = () => import('./pages/notes/_---slug_.astro.mjs');
const _page9 = () => import('./pages/oauth/callback.astro.mjs');
const _page10 = () => import('./pages/oauth.astro.mjs');
const _page11 = () => import('./pages/og-image/_---slug_.png.astro.mjs');
const _page12 = () => import('./pages/posts/_---page_.astro.mjs');
const _page13 = () => import('./pages/posts/_---slug_.astro.mjs');
const _page14 = () => import('./pages/rss.xml.astro.mjs');
const _page15 = () => import('./pages/tags/_tag_/_---page_.astro.mjs');
const _page16 = () => import('./pages/tags.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["node_modules/astro-decap-cms-oauth/src/admin.astro", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/disclaimer.astro", _page5],
    ["src/pages/notes/rss.xml.ts", _page6],
    ["src/pages/notes/[...page].astro", _page7],
    ["src/pages/notes/[...slug].astro", _page8],
    ["node_modules/astro-decap-cms-oauth/src/oauth/callback.ts", _page9],
    ["node_modules/astro-decap-cms-oauth/src/oauth/index.ts", _page10],
    ["src/pages/og-image/[...slug].png.ts", _page11],
    ["src/pages/posts/[...page].astro", _page12],
    ["src/pages/posts/[...slug].astro", _page13],
    ["src/pages/rss.xml.ts", _page14],
    ["src/pages/tags/[tag]/[...page].astro", _page15],
    ["src/pages/tags/index.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "4605395f-d1a7-4238-a862-7f37144f9c23",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
