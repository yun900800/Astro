import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const DRAFT_DIRS = [
	{ draft: "src/content/draft/note", target: "src/content/note" },
	{ draft: "src/content/draft/post", target: "src/content/post" },
];

function splitFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return null;
	return { frontmatter: match[1], rest: content.slice(match[0].length) };
}

export function isPublishEnabled(content) {
	const parts = splitFrontmatter(content);
	if (!parts) return false;
	for (const line of parts.frontmatter.split(/\r?\n/)) {
		const match = line.match(/^publish\s*:\s*(.*)$/);
		if (match) {
			const value = (match[1] ?? "").trim().replace(/^["']|["']$/g, "");
			return value.toLowerCase() === "true";
		}
	}
	return false;
}

export function removePublishLine(content) {
	const parts = splitFrontmatter(content);
	if (!parts) return content;
	const newline = content.includes("\r\n") ? "\r\n" : "\n";
	const kept = parts.frontmatter.split(/\r?\n/).filter((line) => !/^publish\s*:/.test(line.trim()));
	return `---${newline}${kept.join(newline)}${newline}---${newline}${parts.rest}`;
}

async function listMarkdownFiles(rootDir, dir) {
	try {
		const entries = await readdir(join(rootDir, dir), { withFileTypes: true });
		return entries
			.filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
			.map((entry) => entry.name);
	} catch {
		return [];
	}
}

export async function publishDrafts(rootDir) {
	const moved = [];
	for (const { draft, target } of DRAFT_DIRS) {
		for (const name of await listMarkdownFiles(rootDir, draft)) {
			const fromAbs = join(rootDir, draft, name);
			const content = await readFile(fromAbs, "utf8");
			if (!isPublishEnabled(content)) continue;
			const cleaned = removePublishLine(content);
			const toAbs = join(rootDir, target, name);
			await mkdir(dirname(toAbs), { recursive: true });
			await writeFile(toAbs, cleaned, "utf8");
			await rm(fromAbs);
			moved.push({ from: `${draft}/${name}`, to: `${target}/${name}` });
		}
	}
	return { moved };
}

async function main() {
	const rootDir = process.argv[2] ?? process.cwd();
	const { moved } = await publishDrafts(rootDir);
	if (moved.length === 0) {
		console.log("publish-drafts: no drafts marked for publish.");
		return;
	}
	console.log(`publish-drafts: published ${moved.length} item(s).`);
	for (const item of moved) {
		console.log(`  ${item.from} -> ${item.to}`);
	}
}

const invokedDirectly =
	process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
	await main();
}
