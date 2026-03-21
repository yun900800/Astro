# AGENTS.md

Instructions for agentic coding agents operating in this Astro blog repository.

## Project Overview

This is an Astro-based blog site (Cactus theme fork) using:

- **Framework**: Astro 5.x with SSR (Vercel adapter)
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Linting**: Biome
- **Formatting**: Biome + Prettier
- **TypeScript**: Strict mode (extends `astro/tsconfigs/strictest`)
- **Package manager**: pnpm v9

## Build / Dev / Deploy Commands

```bash
pnpm dev          # Start dev server (http://localhost:4321)
pnpm start        # Alias for pnpm dev
pnpm build        # Build for production
pnpm preview      # Preview production build locally
pnpm check        # Run Astro type checking (tsc)
pnpm lint         # Run Biome linting
pnpm format       # Format all code (biome + prettier)
pnpm format:code  # Format code only (biome + prettier)
pnpm format:imports # Sort/format imports with biome
```

## Code Style Guidelines

### General

- **Indentation**: Tabs (2 spaces display width)
- **Line width**: 100 chars (80 for .md/.mdx files)
- **Semicolons**: Always required
- **Trailing commas**: All (ES5 trailing commas)
- **Quotes**: Double quotes in JS/TS (per Biome defaults)

### TypeScript

- Uses `astro/tsconfigs/strictest` - strict type checking enabled
- Path aliases available: `@/*` maps to `src/*`
- Use `import type` for type-only imports
- Prefer explicit return types on exported functions
- Use `// @ts-expect-error` comments sparingly with explanation

### Astro Components (.astro)

- Frontmatter uses TypeScript with imports at top
- Props defined via `type Props = ...;` interface
- Prefer Astro components over React for static content
- Use `data-astro-prefetch` for internal navigation links

### Tailwind CSS

- Use Tailwind utility classes in templates
- Custom colors defined via CSS custom properties in `src/styles/global.css`
- Dark mode via `[data-theme="dark"]` class on `<html>`
- Use `cactus-link` class for themed links
- Typography prose classes for markdown content

### Imports

- Use path aliases: `import { foo } from "@/components/foo";`
- Group imports: 1) Node built-ins, 2) External packages, 3) Internal aliases (@/)
- Biome handles import sorting automatically
- Keep imports alphabetically sorted within groups

### Naming Conventions

- **Components**: PascalCase (`BaseHead.astro`, `ThemeToggle.ts`)
- **Utils/functions**: camelCase (`generateToc.ts`, `getFormattedDate`)
- **Config files**: camelCase or kebab-case
- **Types/interfaces**: PascalCase with descriptive names
- **CSS classes**: kebab-case (Tailwind utilities)

### Error Handling

- Use optional chaining (`?.`) and nullish coalescing (`??`) to avoid explicit null checks where appropriate
- Return early for error conditions to reduce nesting
- Provide meaningful error messages in thrown errors
- Use Zod schemas for content collection validation (see `src/content.config.ts`)

## File Structure

```
src/
├── components/       # Astro components (UI)
│   ├── blog/         # Blog-specific components
│   ├── layout/       # Layout components (Header, Footer)
│   └── note/         # Note-specific components
├── content/          # Blog posts (post/) and notes (note/)
│   └── config.ts     # Content collection schemas
├── data/             # Static data files
├── layouts/          # Page layouts
├── pages/            # Astro pages and API routes
├── plugins/          # Astro/Remark/Rehype plugins
├── styles/           # Global CSS (Tailwind base)
├── types.ts          # Shared TypeScript interfaces
├── site.config.ts   # Site metadata and menu config
├── utils/            # Utility functions
│   ├── date.ts       # Date formatting
│   ├── domElement.ts # DOM utilities
│   ├── generateToc.ts # TOC generation
│   ├── seo.ts        # JSON-LD generators
│   └── webmentions.ts # Webmentions API
└── env.d.ts          # Astro env type declarations
```

## Content Collections

- **post**: Blog articles in `src/content/post/` (`.md`/`.mdx`)
- **note**: Short notes in `src/content/note/` (`.md`/`.mdx`)

Schema validation is done via Zod in `src/content.config.ts`. Frontmatter fields:

- `title`: string (required, max 60 chars)
- `description`: string (posts required, notes optional)
- `publishDate`: ISO date string `YYYY-MM-DD HH:mm`
- `updatedDate`: optional ISO date string
- `tags`: string array (posts only, auto-lowercased/deduped)
- `draft`: boolean (defaults to false)
- `coverImage`: object with `src` and `alt`

## Workflow Notes

1. **Before committing**: Run `pnpm format && pnpm lint` to ensure consistent formatting
2. **Type checking**: Run `pnpm check` to verify TypeScript types
3. **Preview changes**: Use `pnpm preview` after `pnpm build` to test production build
4. **OG images**: Generated via `src/pages/og-image/[slug].png.ts` using Satori
5. **Expressive Code**: Code blocks use `astro-expressive-code` with Dracula/GitHub Light themes
