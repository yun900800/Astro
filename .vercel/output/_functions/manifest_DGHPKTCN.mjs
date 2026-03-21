import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_HUK9o754.mjs';
import 'es-module-lexer';
import { j as decodeKey } from './chunks/astro/server_CZ1CvF95.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/86135/Desktop/code/Astro/","adapterName":"@astrojs/vercel","routes":[{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"disclaimer/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/disclaimer","isIndex":false,"type":"page","pattern":"^\\/disclaimer\\/?$","segments":[[{"content":"disclaimer","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/disclaimer.astro","pathname":"/disclaimer","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"tags/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tags","isIndex":true,"type":"page","pattern":"^\\/tags\\/?$","segments":[[{"content":"tags","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tags/index.astro","pathname":"/tags","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DTIbhfSr.js"}],"styles":[{"type":"inline","content":"[data-astro-image]{aspect-ratio:var(--w) /var(--h);height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);width:100%}[data-astro-image=responsive]{max-height:calc(var(--h)*1px);max-width:calc(var(--w)*1px)}[data-astro-image=fixed]{height:calc(var(--h)*1px);width:calc(var(--w)*1px)}\n"}],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DTIbhfSr.js"}],"styles":[],"routeData":{"type":"page","isIndex":false,"route":"/admin","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro-decap-cms-oauth/src/admin.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DTIbhfSr.js"}],"styles":[{"type":"inline","content":"[data-astro-image]{aspect-ratio:var(--w) /var(--h);height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);width:100%}[data-astro-image=responsive]{max-height:calc(var(--h)*1px);max-width:calc(var(--w)*1px)}[data-astro-image=fixed]{height:calc(var(--h)*1px);width:calc(var(--w)*1px)}\n"}],"routeData":{"route":"/notes/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/notes\\/rss\\.xml\\/?$","segments":[[{"content":"notes","dynamic":false,"spread":false}],[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/notes/rss.xml.ts","pathname":"/notes/rss.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DTIbhfSr.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/oauth/callback","pattern":"^\\/oauth\\/callback$","segments":[[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro-decap-cms-oauth/src/oauth/callback.ts","pathname":"/oauth/callback","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DTIbhfSr.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/oauth","pattern":"^\\/oauth$","segments":[[{"content":"oauth","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro-decap-cms-oauth/src/oauth/index.ts","pathname":"/oauth","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DTIbhfSr.js"}],"styles":[{"type":"inline","content":"[data-astro-image]{aspect-ratio:var(--w) /var(--h);height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);width:100%}[data-astro-image=responsive]{max-height:calc(var(--h)*1px);max-width:calc(var(--w)*1px)}[data-astro-image=fixed]{height:calc(var(--h)*1px);width:calc(var(--w)*1px)}\n"}],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.ts","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://innovation.pp.ua/","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/86135/Desktop/code/Astro/node_modules/astro-decap-cms-oauth/src/admin.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/components/note/Note.astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/notes/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/notes/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/notes/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/notes/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/data/post.ts",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/layouts/BlogPost.astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/posts/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/posts/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/og-image/[...slug].png.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/og-image/[...slug].png@_@ts",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/posts/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/posts/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/tags/[tag]/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/tags/[tag]/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/tags/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/tags/index@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/notes/rss.xml.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/notes/rss.xml@_@ts",{"propagation":"in-tree","containsHead":false}],["C:/Users/86135/Desktop/code/Astro/src/pages/404.astro",{"propagation":"none","containsHead":true}],["C:/Users/86135/Desktop/code/Astro/src/pages/about.astro",{"propagation":"none","containsHead":true}],["C:/Users/86135/Desktop/code/Astro/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["C:/Users/86135/Desktop/code/Astro/src/pages/disclaimer.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:node_modules/astro-decap-cms-oauth/src/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/disclaimer@_@astro":"pages/disclaimer.astro.mjs","\u0000@astro-page:src/pages/notes/rss.xml@_@ts":"pages/notes/rss.xml.astro.mjs","\u0000@astro-page:src/pages/notes/[...page]@_@astro":"pages/notes/_---page_.astro.mjs","\u0000@astro-page:src/pages/notes/[...slug]@_@astro":"pages/notes/_---slug_.astro.mjs","\u0000@astro-page:node_modules/astro-decap-cms-oauth/src/oauth/callback@_@ts":"pages/oauth/callback.astro.mjs","\u0000@astro-page:node_modules/astro-decap-cms-oauth/src/oauth/index@_@ts":"pages/oauth.astro.mjs","\u0000@astro-page:src/pages/posts/[...page]@_@astro":"pages/posts/_---page_.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@ts":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/tags/[tag]/[...page]@_@astro":"pages/tags/_tag_/_---page_.astro.mjs","\u0000@astro-page:src/pages/tags/index@_@astro":"pages/tags.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/og-image/[...slug].png@_@ts":"pages/og-image/_---slug_.png.astro.mjs","\u0000@astro-page:src/pages/posts/[...slug]@_@astro":"pages/posts/_---slug_.astro.mjs","C:/Users/86135/Desktop/code/Astro/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_5bOJjQGW.mjs","C:\\Users\\86135\\Desktop\\code\\Astro\\.astro\\content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_LoMZYgoM.mjs","\u0000@astrojs-manifest":"manifest_DGHPKTCN.mjs","C:\\Users\\86135\\Desktop\\code\\Astro\\.astro\\content-assets.mjs":"chunks/content-assets_BbM9gLKO.mjs","C:/Users/86135/Desktop/code/Astro/src/layouts/BlogPost.astro?astro&type=script&index=0&lang.ts":"_astro/BlogPost.astro_astro_type_script_index_0_lang.CSRpGidt.js","C:/Users/86135/Desktop/code/Astro/src/components/layout/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.DuSsDY4R.js","C:/Users/86135/Desktop/code/Astro/src/components/Search.astro?astro&type=script&index=0&lang.ts":"_astro/Search.astro_astro_type_script_index_0_lang.BL-Zfywt.js","C:/Users/86135/Desktop/code/Astro/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts":"_astro/ThemeToggle.astro_astro_type_script_index_0_lang.CB-gjd7v.js","astro:scripts/page.js":"_astro/page.DTIbhfSr.js","C:/Users/86135/Desktop/code/Astro/node_modules/@pagefind/default-ui/npm_dist/mjs/ui-core.mjs":"_astro/ui-core.DpoOKyyL.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/86135/Desktop/code/Astro/src/layouts/BlogPost.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"to-top-btn\"),n=document.getElementById(\"blog-hero\");function c(t){t.forEach(o=>{e.dataset.show=(!o.isIntersecting).toString()})}e.addEventListener(\"click\",()=>{document.documentElement.scrollTo({behavior:\"smooth\",top:0})});const r=new IntersectionObserver(c);r.observe(n);"]],"assets":["/_astro/ec.x0vho.css","/_astro/ec.8zarh.js","/_astro/roboto-mono-700.CAZppuP3.ttf","/_astro/roboto-mono-regular.Ceay284C.ttf","/_astro/logo.DMXfm6vf.png","/_astro/1215191008.CzYcTbO3.avif","/_astro/cover.C1CigIB6.png","/_astro/_slug_.r08rjRKh.css","/ads.txt","/icon.svg","/qssjdr.jpg","/social-card.avif","/sw.js","/admin/config.yml","/icons/bilibili.svg","/icons/linux.do.svg","/icons/nodeseek.svg","/_astro/domElement.CpM5XNjJ.js","/_astro/Header.astro_astro_type_script_index_0_lang.DuSsDY4R.js","/_astro/page.DTIbhfSr.js","/_astro/Search.astro_astro_type_script_index_0_lang.BL-Zfywt.js","/_astro/ThemeToggle.astro_astro_type_script_index_0_lang.CB-gjd7v.js","/_astro/ui-core.DpoOKyyL.js","/assets/images/20250219.jpg","/assets/images/wechatimg43.jpg","/_astro/page.DTIbhfSr.js","/404.html","/about/index.html","/contact/index.html","/disclaimer/index.html","/tags/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"+kt21nftn2xOLP53d3G4OW/y7l9a/tY+LN8/AdK7ZPQ=","envGetSecretEnabled":true});

export { manifest };
