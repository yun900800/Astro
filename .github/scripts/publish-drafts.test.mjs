import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { isPublishEnabled, publishDrafts, removePublishLine } from "./publish-drafts.mjs";

const roots = [];

async function makeRoot() {
	const root = await mkdtemp(join(tmpdir(), "publish-drafts-"));
	roots.push(root);
	return root;
}

async function seed(root, dir, name, content) {
	await mkdir(join(root, dir), { recursive: true });
	await writeFile(join(root, dir, name), content, "utf8");
}

async function exists(root, dir, name) {
	try {
		await readFile(join(root, dir, name), "utf8");
		return true;
	} catch {
		return false;
	}
}

after(async () => {
	await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
});

const draftNote = (publish) => `---\ntitle: 测试草稿\npublish: ${publish}\n---\n\n正文\n`;

test("isPublishEnabled 识别 true/false/缺失", () => {
	assert.equal(isPublishEnabled(draftNote("true")), true);
	assert.equal(isPublishEnabled(draftNote("false")), false);
	assert.equal(isPublishEnabled("---\ntitle: x\n---\nbody"), false);
	assert.equal(isPublishEnabled("no frontmatter"), false);
});

test("removePublishLine 删除 publish 行并保留其它内容", () => {
	const cleaned = removePublishLine(draftNote("true"));
	assert.equal(cleaned, "---\ntitle: 测试草稿\n---\n\n正文\n");
});

test("publishDrafts 把打钩的笔记草稿搬到正式集合并去掉标记", async () => {
	const root = await makeRoot();
	await seed(root, "src/content/draft/note", "a.md", draftNote("true"));
	const { moved } = await publishDrafts(root);
	assert.deepEqual(moved, [{ from: "src/content/draft/note/a.md", to: "src/content/note/a.md" }]);
	assert.equal(await exists(root, "src/content/draft/note", "a.md"), false);
	assert.equal(await exists(root, "src/content/note", "a.md"), true);
	const published = await readFile(join(root, "src/content/note/a.md"), "utf8");
	assert.equal(published.includes("publish:"), false);
	assert.equal(published.includes("正文"), true);
});

test("publishDrafts 忽略未打钩的草稿", async () => {
	const root = await makeRoot();
	await seed(root, "src/content/draft/note", "b.md", draftNote("false"));
	const { moved } = await publishDrafts(root);
	assert.equal(moved.length, 0);
	assert.equal(await exists(root, "src/content/draft/note", "b.md"), true);
	assert.equal(await exists(root, "src/content/note", "b.md"), false);
});

test("publishDrafts 同名覆盖已发布文件", async () => {
	const root = await makeRoot();
	await seed(root, "src/content/note", "c.md", "---\ntitle: 旧\n---\n\n旧正文\n");
	await seed(root, "src/content/draft/note", "c.md", draftNote("true"));
	await publishDrafts(root);
	const published = await readFile(join(root, "src/content/note/c.md"), "utf8");
	assert.equal(published.includes("正文"), true);
	assert.equal(published.includes("旧正文"), false);
});

test("publishDrafts 把打钩的博文草稿搬到 post", async () => {
	const root = await makeRoot();
	await seed(root, "src/content/draft/post", "d.md", draftNote("true"));
	const { moved } = await publishDrafts(root);
	assert.deepEqual(moved, [{ from: "src/content/draft/post/d.md", to: "src/content/post/d.md" }]);
	assert.equal(await exists(root, "src/content/post", "d.md"), true);
});
