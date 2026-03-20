import { g as getCollection } from './_astro_content_rWTpQcbq.mjs';

async function getAllPosts() {
  return await getCollection("post", ({ id, data }) => {
    {
      const isDemo = id.startsWith("demo/");
      return !data.draft && !isDemo;
    }
  });
}
function groupPostsByYear(posts) {
  return posts.reduce((acc, post) => {
    const year = post.data.publishDate.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year]?.push(post);
    return acc;
  }, {});
}
function getAllTags(posts) {
  return posts.flatMap((post) => [...post.data.tags]);
}
function getUniqueTags(posts) {
  return [...new Set(getAllTags(posts))];
}
function getUniqueTagsWithCount(posts) {
  return [
    ...getAllTags(posts).reduce(
      (acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
      /* @__PURE__ */ new Map()
    )
  ].sort((a, b) => b[1] - a[1]);
}

export { getAllPosts as a, getUniqueTags as b, getUniqueTagsWithCount as c, groupPostsByYear as g };
