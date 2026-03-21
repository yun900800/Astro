import { g as getCollection } from './_astro_content_CeIVgrIS.mjs';

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
function getRelatedPosts(currentPost, allPosts, limit = 3) {
  const currentTags = new Set(currentPost.data.tags);
  return allPosts.filter((post) => post.id !== currentPost.id).map((post) => {
    const sharedTags = post.data.tags.filter((tag) => currentTags.has(tag));
    return { post, score: sharedTags.length };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((item) => item.post);
}

export { getAllPosts as a, getUniqueTags as b, getUniqueTagsWithCount as c, getRelatedPosts as d, groupPostsByYear as g };
