# AGENTS.md

Guidance for AI coding agents working in `@lipemat/js-boilerplate-shared`.

## What this is
A **shared utility library** (not an application) providing the build/config
primitives — webpack externals, PostCSS pipeline, Jest/Babel config, CSS
class-name generation, package-config resolution — consumed by
`@lipemat/js-boilerplate` and its `js-boilerplate-*` extension packages for
WordPress theme/plugin front-ends.

## Quick start
```bash
yarn test          # jest --config ./jest/jest.config.ts (non-default path)
yarn lint          # eslint --fix --cache
yarn validate-ts   # tsc --noEmit
yarn build         # tsc --project ./bin  (regenerates bin/*.js + maps)
```
Node `>=22.21`, Yarn Berry 4.17 (PnP) — use `yarn`, never `npm`.

## The one thing to get right
This is a **NodeNext ESM** package with `verbatimModuleSyntax`. Import
specifiers **must carry `.js`** even when the target is a `.ts` file:
`import {getPackageConfig} from './package-config.js';`. Config flows from the
consumer's `package.json` through `getPackageConfig()`, then extension + local
overrides are merged last.

## Detailed guides
- [Architecture & core modules](.github/agents-sections/architecture.md) —
  components, distribution model (raw `.ts` vs built `bin/`), data flow.
- [Developer workflows](.github/agents-sections/workflows.md) — commands,
  toolchain, post-change checks.
- [Conventions & patterns](.github/agents-sections/conventions.md) — ESM rules,
  code style, resettable-state pattern, testing/mocking, shared types.

## Non-negotiables
- Run `yarn lint`, `yarn validate-ts`, `yarn test` after changes; `yarn build`
  after any `bin/` edit and commit the regenerated output.
- Never suppress scan warnings (`@ts-ignore`, `eslint-disable`, etc.).
- Keep cached/counter state externally resettable (see `css-classnames.ts`,
  `package-config.ts`) — never a module-private cache.
- Yoda conditionals, single quotes, tabs, LF.
