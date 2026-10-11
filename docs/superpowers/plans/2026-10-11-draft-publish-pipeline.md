# 草稿「发布」流水线 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让「草稿箱-笔记/博文」里的「发布」开关触发一条 GitHub Actions 流水线，把打钩的草稿搬进正式集合并提交，从而真正上线。

**Architecture:** 保留草稿箱作为暂存区；给两个草稿集合加 `publish` 布尔字段；一个新的 GitHub Actions 工作流在推送落到 `src/content/draft/**` 时运行一个无依赖的 Node 脚本，把 `publish: true` 的草稿移动到 `src/content/note` 或 `src/content/post`（去掉 `publish`、同名覆盖）并提交。该提交改动正式集合 → Vercel 正常构建 → 上线。

**Tech Stack:** Astro content collections（Zod）、Decap CMS（YAML 配置）、GitHub Actions、Node.js 24（内置 `node:test`，无第三方依赖）。

**Spec:** `docs/superpowers/specs/2026-10-11-draft-publish-design.md`

## Global Constraints

- Node 24（与 `package.json` 的 `engines.node` 一致）；脚本**不得**引入任何第三方依赖。
- 代码风格遵循 Biome：制表符缩进、双引号、分号、行宽 100（`.md` 为 80）。
- 工作流使用内置 `GITHUB_TOKEN`（`permissions: contents: write`），**不得**要求 PAT。
- 目录映射固定：`src/content/draft/note` → `src/content/note`；`src/content/draft/post` → `src/content/post`。
- 发布提交信息固定前缀：`chore(publish):`。
- 不改动 `vercel.json`（其 `ignoreCommand` 已保证"只改草稿不构建"）。

---

### Task 1: 内容模型——给草稿集合加 `publish` 字段

**Files:**
- Modify: `public/admin/config.yml`（`draft_note` 与 `draft_post` 两个集合的 `fields`）
- Modify: `src/content.config.ts`（`draftNote` 与 `draftPost` 两个 schema）

**Interfaces:**
- Produces: 草稿 Markdown 的 frontmatter 中允许出现 `publish: true|false`（布尔）。
- Produces: 供 Task 2 的脚本读取并移除的字段名 `publish`。

- [ ] **Step 1: 在 Decap 配置里加字段**

在 `public/admin/config.yml` 中，给 `draft_note` 的 `fields` 末尾（`- { label: "正文", ... }` 之后）追加：

```yaml
      - {
          label: "发布",
          name: "publish",
          widget: "boolean",
          default: false,
          required: false,
          hint: "打开本开关再保存即发布上线；发布后本条目会从草稿箱移出。",
        }
```

对 `draft_post` 的 `fields` 末尾做**同样**追加（两处内容一致）。

- [ ] **Step 2: 在内容 schema 里加字段**

在 `src/content.config.ts` 中，于 `draftNote` 的 schema 对象内加入：

```ts
		publish: z.boolean().default(false),
```

对 `draftPost` 的 schema 对象做**同样**加入。

> 说明：`post` / `note` 两个正式集合的 schema **不加**此字段——发布脚本会在搬移时把它删除。
> Zod 对象默认会剥离未知键，因此即便遗漏也不会报错，但显式声明让类型与校验完整。

- [ ] **Step 3: 校验配置与类型**

Run: `pnpm check`
Expected: 退出码 0（无类型/内容校验错误）。

- [ ] **Step 4: 确认字段已就位**

Run: `rg -n "publish" public/admin/config.yml src/content.config.ts`
Expected: 在 `config.yml` 出现 2 处 `name: "publish"`，在 `content.config.ts` 出现 2 处 `publish: z.boolean()`。

- [ ] **Step 5: Commit**

```bash
git add public/admin/config.yml src/content.config.ts
git commit -m "feat(cms): add publish toggle to draft collections"
```

---

### Task 2: 发布脚本（TDD）

**Files:**
- Create: `.github/scripts/publish-drafts.mjs`
- Test: `.github/scripts/publish-drafts.test.mjs`

**Interfaces:**
- Produces: `isPublishEnabled(content: string): boolean`
- Produces: `removePublishLine(content: string): string`
- Produces: `publishDrafts(rootDir: string): Promise<{ moved: { from: string; to: string }[] }>`
  - `from`/`to` 为**相对 `rootDir`** 的 POSIX 路径（如 `src/content/draft/note/a.md`）。
- CLI：`node .github/scripts/publish-drafts.mjs [rootDir]`，默认 `rootDir = process.cwd()`。

- [ ] **Step 1: 写失败的测试**

创建 `.github/scripts/publish-drafts.test.mjs`：

```js
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
	assert.deepEqual(moved, [
		{ from: "src/content/draft/note/a.md", to: "src/content/note/a.md" },
	]);
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
	assert.deepEqual(moved, [
		{ from: "src/content/draft/post/d.md", to: "src/content/post/d.md" },
	]);
	assert.equal(await exists(root, "src/content/post", "d.md"), true);
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test .github/scripts/publish-drafts.test.mjs`
Expected: FAIL —— 报错 `Cannot find module './publish-drafts.mjs'`（脚本尚未创建）。

- [ ] **Step 3: 写最小实现**

创建 `.github/scripts/publish-drafts.mjs`：

```js
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
	const kept = parts.frontmatter
		.split(/\r?\n/)
		.filter((line) => !/^publish\s*:/.test(line.trim()));
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
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `node --test .github/scripts/publish-drafts.test.mjs`
Expected: PASS —— 6 个测试全部通过。

- [ ] **Step 5: 代码风格校验**

Run: `node_modules/.bin/biome check .github/scripts`
Expected: 无错误（如报格式问题，运行 `node_modules/.bin/biome check --write .github/scripts` 后重跑）。

- [ ] **Step 6: Commit**

```bash
git add .github/scripts/publish-drafts.mjs .github/scripts/publish-drafts.test.mjs
git commit -m "feat(ci): add draft publish script with tests"
```

---

### Task 3: GitHub Actions 工作流

**Files:**
- Create: `.github/workflows/publish-drafts.yml`

**Interfaces:**
- Consumes: `.github/scripts/publish-drafts.mjs`（Task 2）。
- Produces: 在 `main` 上、改动落在 `src/content/draft/**` 时自动运行；支持手动 `workflow_dispatch`。

- [ ] **Step 1: 创建工作流**

创建 `.github/workflows/publish-drafts.yml`：

```yaml
name: Publish drafts

on:
  push:
    branches: [main]
    paths:
      - "src/content/draft/**"
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: publish-drafts
  cancel-in-progress: false

jobs:
  publish:
    if: github.actor != 'github-actions[bot]'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "24"

      - name: Publish marked drafts
        run: node .github/scripts/publish-drafts.mjs

      - name: Commit and push
        run: |
          if [ -z "$(git status --porcelain)" ]; then
            echo "Nothing to publish."
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A src/content
          git commit -m "chore(publish): publish marked drafts"
          git push
```

> 备注：用内置 `GITHUB_TOKEN` 的 push **不会**再触发新的工作流，因此不存在自触发死循环；`if: github.actor != 'github-actions[bot]'` 是额外保险。

- [ ] **Step 2: 提交**

```bash
git add .github/workflows/publish-drafts.yml
git commit -m "ci: add publish-drafts workflow"
```

- [ ] **Step 3: 推送后确认工作流已注册**

Run: `git push origin main; gh workflow list`
Expected: 列表中出现 `Publish drafts`（active）。

---

### Task 4: 端到端验证（真实发布一条测试草稿）

**Files:** 无（验证任务；会临时创建/删除一条测试草稿）。

- [ ] **Step 1: 造一条"已打钩"的测试草稿并推送**

```bash
mkdir -p src/content/draft/note 2>/dev/null || true
```

创建 `src/content/draft/note/2026.10.11_发布流水线测试.md`：

```markdown
---
title: 发布流水线测试
description: e2e
publishDate: 2026-10-11 12:00
publish: true
---

这是发布流水线的端到端测试内容。
```

```bash
git add src/content/draft/note/2026.10.11_发布流水线测试.md
git commit -m "test: seed publish-flag draft"
git push origin main
```

- [ ] **Step 2: 验证草稿那次部署被跳过**

用 `gh` 或 Vercel 面板查看该提交对应的部署。
Expected: 该次部署为 **Canceled/Skipped**（`ignoreCommand` 命中，未构建）。

- [ ] **Step 3: 验证工作流运行成功**

Run: `gh run list --workflow publish-drafts.yml --limit 3`
Expected: 最近一次运行 **success**。

- [ ] **Step 4: 验证文件已搬移**

Run（先拉取）：

```bash
git pull origin main
```

Expected:
- `src/content/note/2026.10.11_发布流水线测试.md` 存在，且 frontmatter **不含** `publish`。
- `src/content/draft/note/2026.10.11_发布流水线测试.md` **已删除**。
- 最新提交信息为 `chore(publish): publish marked drafts`。

- [ ] **Step 5: 验证已上线**

Run: `gh run list --limit 3`（Vercel 侧）或在 Vercel 面板查看由该 `chore(publish):` 提交触发的生产构建。
Expected: Vercel 生产构建 **success**，站点上可访问到《发布流水线测试》。

- [ ] **Step 6: 反向用例——未打钩的草稿不动**

创建 `src/content/draft/note/2026.10.11_不发布测试.md`（`publish: false` 或省略），提交推送。

Expected: 工作流成功但 `moved.length == 0`（日志 `no drafts marked for publish`）；该文件仍在草稿箱；无新的发布提交。

- [ ] **Step 7: 清理测试内容**

删除两条测试笔记（若已上线，删除正式集合中的那条）并提交推送。

```bash
git add -A src/content
git commit -m "test: remove publish pipeline fixtures"
git push origin main
```

---

## Self-Review

- **Spec coverage**：字段（Task 1）↔ spec 组件 1/2；脚本（Task 2）↔ spec 组件 4；工作流（Task 3）↔ spec 组件 3；数据流/边界/测试（Task 4）↔ spec 数据流、边界、测试方案。覆盖完整。
- **Placeholder scan**：无 TBD/TODO；所有代码步骤均含完整代码。
- **Type consistency**：`isPublishEnabled` / `removePublishLine` / `publishDrafts` 的名称与签名在 Task 2 的接口、测试、实现中一致；`moved[].from/to` 结构在测试与 Task 4 验证中一致。
