import { siteConfig } from "@/site.config";

const SITE_URL = "https://innovation.pp.ua/";

/**
 * 生成博客文章的结构化数据 (JSON-LD)
 */
export function generateArticleJsonLd(
  title: string,
  description: string,
  publishDate: Date,
  updatedDate?: Date,
  url?: string,
  author?: string,
  tags?: string[]
) {
  const canonicalUrl = url ? `${SITE_URL}${url.replace(/^\//, "")}` : SITE_URL;
  const datePublished = publishDate.toISOString();
  const dateModified = (updatedDate || publishDate).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    datePublished,
    dateModified,
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: author || siteConfig.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
      url: SITE_URL,
    },
    ...(tags && tags.length > 0 && {
      keywords: tags.join(", "),
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": SITE_URL,
    },
  };
}

/**
 * 生成网站的结构化数据 (JSON-LD)
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    description: siteConfig.description,
    url: SITE_URL,
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}posts/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * 生成面包屑的结构化数据 (JSON-LD)
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url.replace(/^\//, "")}`,
    })),
  };
}

/**
 * 生成笔记的结构化数据 (JSON-LD)
 */
export function generateNoteJsonLd(
  title: string,
  publishDate: Date,
  url?: string
) {
  const canonicalUrl = url ? `${SITE_URL}${url.replace(/^\//, "")}` : SITE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@subtype": "Note",
    headline: title,
    datePublished: publishDate.toISOString(),
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: SITE_URL,
    },
  };
}
