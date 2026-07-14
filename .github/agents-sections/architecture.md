# Architecture

`@lipemat/js-boilerplate-shared` is a **shared utility library**, not an app. It
provides the build/config primitives consumed by `@lipemat/js-boilerplate` and
its `js-boilerplate-*` extensions (webpack, PostCSS, Jest, Babel setups for
WordPress theme/plugin front-ends).

## Distribution model
- Ships **raw `.ts`** for `helpers/`, `config/`, `lib/`, `types/` — consumers
  transpile them through Babel (`transformIgnorePatterns: node_modules/(?!@lipemat)`).
- Ships **transpiled `.js` + `.js.map`** only for `bin/` (built via
  `tsc --project ./bin`). Never hand-edit the `.js`/`.map` next to a `.ts` —
  regenerate with `yarn build`.
- `package.json#files` = `bin config helpers lib types`.

## Core modules (`helpers/`)
- **`package-config.ts`** — the config backbone. Reads the *consumer's*
  `package.json` + optional `local-config.json`, merges with `defaults`.
  `getPackageConfig()` is the single accessor; `modifyPackageConfig()` /
  `resetPackageConfig()` exist so tests can mutate it. Distinguishes
  `packageDirectory` (the theme root) from `workingDirectory` (`jsPath`, the JS
  source root).
- **`config.ts`** — extension system. `getExtensions()` finds installed
  `js-boilerplate-*` deps (excluding the two libs). `getExtensionsConfig()` and
  `mergeWithLocalConfig()` merge a named config file across every extension +
  the local project, supporting both object exports and `(config) => config`
  callbacks.
- **`postcss-config.ts`** — assembles the PostCSS plugin pipeline
  (global-data → import → custom-media → nested → preset-env → color-mod →
  sort-media-queries, then clean-css for prod / pretty for dev), auto-loads
  `variables.pcss` / `media-queries.pcss` if present, then merges extension +
  local `postcss.config`.
- **`css-classnames.ts`** — deterministic short CSS class generator for
  css-loader `getLocalIdent`. State lives on `globalThis[__JS_BOILERPLATE_...]`
  so it survives multiple webpack entries and is resettable in tests
  (`resetCounters()`).
- **`wp-externals.ts`** — maps `@wordpress/*` + react/jquery/etc. to WP globals
  (`window.wp.*`) for webpack `externals`.
- **`browserslist.ts`** — falls back to `@wordpress/browserslist-config` when the
  project has no explicit browserslist.

## Data flow
Consumer `package.json`/`local-config.json` → `getPackageConfig()` →
config assemblers (`postcss-config`, `jest.config`, css-classnames) →
extension/local overrides merged last.
