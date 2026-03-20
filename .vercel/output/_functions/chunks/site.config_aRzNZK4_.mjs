const siteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: "敲碎时间的人",
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: "zh-CN",
    options: {
      day: "numeric",
      month: "narrow",
      year: "numeric"
    }
  },
  // Used as the default description meta property and webmanifest description
  description: "敲碎时间的人",
  // HTML lang property, found in src/layouts/Base.astro L:18 & astro.config.ts L:48
  lang: "zh-CN",
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: "zh-CN",
  // Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
  title: "敲碎时间的人"
};
const menuLinks = [
  // 修改：改为中文
  {
    path: "/",
    title: "主页"
  },
  {
    path: "/about/",
    title: "关于"
  },
  {
    path: "/posts/",
    title: "博客"
  },
  {
    path: "/notes/",
    title: "笔记"
  }
];

export { menuLinks as m, siteConfig as s };
