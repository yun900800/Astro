import { type CollectionEntry, getCollection } from "astro:content";

export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
	return await getCollection("post", ({ id }) => {
		if (import.meta.env.PROD) {
			const isDemo = id.startsWith("demo/");
			return !isDemo;
		}
		return true;
	});
}

export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return posts.reduce<Record<string, CollectionEntry<"post">[]>>((acc, post) => {
		const year = post.data.publishDate.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(post);
		return acc;
	}, {});
}

export function getAllTags(posts: CollectionEntry<"post">[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

export function getUniqueTags(posts: CollectionEntry<"post">[]) {
	return [...new Set(getAllTags(posts))];
}

export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}

export function getRelatedPosts(
	currentPost: CollectionEntry<"post">,
	allPosts: CollectionEntry<"post">[],
	limit = 3,
): CollectionEntry<"post">[] {
	const currentTags = new Set(currentPost.data.tags);

	return allPosts
		.filter((post) => post.id !== currentPost.id)
		.map((post) => {
			const sharedTags = post.data.tags.filter((tag) => currentTags.has(tag));
			return { post, score: sharedTags.length };
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => item.post);
}
