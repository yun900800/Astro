# 草稿「发布」流水线设计

日期：2026-10-11
状态：已通过评审，待实现

## 背景与问题

站点用 Decap CMS 管理内容，草稿存放在独立集合：

- `草稿箱-笔记`（`draft_note`）→ `src/content/draft/note`
- `草稿箱-博文`（`draft_post`）→ `src/content/draft/post`

这些草稿集合虽然定义了内容 schema，但**没有任何页面渲染它们**（全站只用
`getCollection("note")` 和 `getCollection("post")`）。因此 Decap 编辑器里的
「发布」按钮对草稿集合而言只是"把文件提交进仓库"，并**不会**让内容上线——名不副实。

我们希望把**保存**和**发布**在草稿箱里真正分开：

- 保存：维持现状——写入草稿箱，不构建、不上线（已由根目录 `vercel.json` 的
  `ignoreCommand` 保证：仅改动 `src/content/draft/**` 时跳过 Vercel 构建）。
- 发布：真正把内容上线。

## 目标

- 在编辑器里加一个「发布」开关；打开并保存即触发真正的发布。
- 发布 = 把草稿文件从草稿箱搬进正式集合，从而触发 Vercel 生产构建并上线。
- 不改动现有「保存」的语义与行为。

## 非目标（YAGNI）

- 不做"发布后再撤回/下线"（保留为未来需求）。
- 不做草稿预览页面。
- 不引入 `publish_mode: editorial_workflow`（会改变全局模型，已被否决）。
- 不处理草稿引用图片的清理逻辑（图片存放在全局 `public/assets/images`，搬移
  Markdown 不影响图片）。

## 方案总览

保留草稿箱作为"待发布暂存区"。为两个草稿集合各加一个布尔字段 `publish`。新增一条
GitHub Actions 流水线：只要推送在 `src/content/draft/**` 下发生改动，就扫描草稿，
把 `publish: true` 的文件**移动**到对应正式集合（去掉 `publish` 字段，同名覆盖）并
提交。这一步改动了正式集合 → 触发 Vercel 构建 → 内容真正上线。

## 组件

### 1. Decap 配置（`public/admin/config.yml`）

给 `draft_note` 与 `draft_post` 的 `fields` 各追加：

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

### 2. 内容 schema（`src/content.config.ts`）

给 `draftNote` 与 `draftPost` 的 schema 各加：

```ts
publish: z.boolean().default(false),
```

使类型与校验认识该字段（正式集合 `post`/`note` 的 schema 不加，脚本会在搬移时移除该
字段）。

### 3. GitHub Actions 工作流（`.github/workflows/publish-drafts.yml`）

- **触发**：
  - `on.push`，`branches: [main]`，`paths: ["src/content/draft/**"]`
  - `on.workflow_dispatch`（便于手动重跑）
- **权限**：`permissions: { contents: write }`（使用内置 `GITHUB_TOKEN`，无需 PAT）。
- **防自触发**：若 `github.actor == 'github-actions[bot]'`，或提交信息以固定前缀
  `chore(publish):` 开头 → 直接跳过。
- **步骤**：checkout → 运行发布脚本 → 若有改动则提交并 push。

### 4. 发布脚本（`.github/scripts/publish-drafts.mjs`）

无第三方依赖的 Node 脚本，逻辑：

对 `src/content/draft/note/**` 与 `src/content/draft/post/**` 下每个 `.md`/`.mdx`：

1. 解析 frontmatter，读取 `publish` 布尔值。
2. 若为 `true`：
   - 目标路径映射：
     `src/content/draft/note/*` → `src/content/note/*`，
     `src/content/draft/post/*` → `src/content/post/*`。
   - 从 frontmatter 中**删除** `publish` 这一行。
   - 写入目标路径（**同名覆盖**）。
   - 删除原草稿文件。
3. 若为 `false` 或缺失 → 原样不动。

脚本结束时统计搬移清单，供工作流生成提交信息；无搬移则以退出码 0 正常结束（非错误）。

## 数据流（一次发布）

1. 编辑草稿 → 打开「发布」→ 保存。
2. Decap 提交到 main（只动 `src/content/draft/**`）→ 现有 `ignoreCommand`
   → Vercel **跳过构建**（不上线）。
3. Actions 工作流触发 → 脚本把文件搬进正式集合、去掉 `publish`、删草稿 → 提交并 push。
4. 该提交改动了 `src/content/note|post` → Vercel **正常构建** → **真正上线**。
5. Action 自身的提交再次触发工作流 → 防自触发守卫命中，且已无 `publish: true`
   草稿 → **空跑**结束。

## 边界与错误处理

- **同名文件已存在**：覆盖（用草稿内容替换正式文件）。
- **一次多条打钩**：同一次运行内全部发布。
- **未打钩/`publish:false` 的草稿**：忽略，保持不动。
- **草稿含媒体引用**：只搬 Markdown；图片路径不变（全局目录），无需处理。
- **脚本无改动可做**：正常结束，不产生空提交。
- **frontmatter 缺失或格式异常**：跳过该文件并在日志中告警，不让整次运行失败。

## 测试方案

1. 新建一条**测试草稿笔记** → 打开「发布」→ 保存。
2. 断言：该次草稿提交对应的 Vercel 部署被**跳过**。
3. 断言：工作流运行成功，`src/content/note/` 出现该文件、草稿箱中已被删除、且
   frontmatter 中不再含 `publish`。
4. 断言：Vercel 生产构建成功，页面可访问到该笔记。
5. 反向用例：新建一条**不打钩**的草稿，确认它保持不动、不产生发布提交。
6. 覆盖用例：对已发布过的同名文件，修改草稿并再次打钩发布，确认正式文件被覆盖。

## 风险与权衡

- **覆盖不可逆**：发布同名文件会替换正式内容。已明示；未来可加"保留旧版本"。
- 依赖 GitHub Actions 与内置 token 写权限（仓库为 PUBLIC，Actions 已启用，默认
  工作流权限为 write，满足要求）。
- 每次发布在历史中多一次机器人提交（可接受）。

## 涉及文件汇总

- `public/admin/config.yml`（改：两个草稿集合各加 `publish` 字段）
- `src/content.config.ts`（改：两个草稿 schema 各加 `publish`）
- `.github/workflows/publish-drafts.yml`（新增）
- `.github/scripts/publish-drafts.mjs`（新增）
- `vercel.json`（不改；现有 `ignoreCommand` 已满足"草稿不构建"）
