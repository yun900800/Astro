import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
	title: z.string().max(60),
});

const postPath = "src/content/post";
const notePath = "src/content/note";
const draftPostPath = "src/content/draft/post";
const draftNotePath = "src/content/draft/note";

const post = defineCollection({
	loader: glob({ base: postPath, pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
		}),
});

const note = defineCollection({
	loader: glob({ base: notePath, pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.refine((val) => {
				const datePattern = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}$/;
				return datePattern.test(val);
			}, "Invalid date format. Expected YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm")
			.transform((val) => {
				const normalizedVal = val.replace("T", " ");
				const [datePart, timePart] = normalizedVal.split(" ");
				if (!datePart || !timePart) {
					throw new Error("Invalid date format. Expected YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm");
				}
				const [year, month, day] = datePart.split("-");
				const [hour, minute] = timePart.split(":");
				if (!year || !month || !day || !hour || !minute) {
					throw new Error("Invalid date format. Expected YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm");
				}
				return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
			}),
	}),
});

const draftPost = defineCollection({
	loader: glob({ base: draftPostPath, pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
		}),
});

const draftNote = defineCollection({
	loader: glob({ base: draftNotePath, pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.refine((val) => {
				const datePattern = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}$/;
				return datePattern.test(val);
			}, "Invalid date format. Expected YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm")
			.transform((val) => {
				const normalizedVal = val.replace("T", " ");
				const [datePart, timePart] = normalizedVal.split(" ");
				if (!datePart || !timePart) {
					throw new Error("Invalid date format. Expected YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm");
				}
				const [year, month, day] = datePart.split("-");
				const [hour, minute] = timePart.split(":");
				if (!year || !month || !day || !hour || !minute) {
					throw new Error("Invalid date format. Expected YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm");
				}
				return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
			}),
	}),
});

export const collections = { post, note, draftPost, draftNote };
