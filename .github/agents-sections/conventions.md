# Conventions

## ESM + module resolution
- `"type": "module"`, `module`/`moduleResolution` = `NodeNext`,
  `verbatimModuleSyntax: true`, `target: ES2024`, `strict: true`.
- **Import specifiers MUST use `.js` even when importing a `.ts` file**, e.g.
  `import {getPackageConfig} from './package-config.js';`. Type-only imports use
  the real extension: `import type {AtLeast} from '../types/utility.ts';`.
- Use `import type` for type-only imports (enforced by verbatimModuleSyntax).
- For CommonJS interop inside ESM, use
  `createRequire( import.meta.url )` (see `config.ts`, `postcss-config.ts`).

## Code style
- Yoda conditionals: `if ( 'production' === env )`, `if ( 0 === last )`.
- Single-quoted strings.
- Spaces inside parens/brackets: `resolve( a, b )`, `[ 'a', 'b' ]`.
- Tabs for indentation, LF line endings.
- Comment only what needs clarifying; no change-narrating comments.
- Never suppress scan warnings (`@ts-ignore`, `eslint-disable`, etc.) — the one
  legacy `@ts-ignore` in `browserslist.ts` is not a pattern to copy.

## No private cache — keep state resettable
Do not hide caches/counters in module-private `let`s. Follow the existing
patterns so tests can reset:
- `css-classnames.ts` stores state on `globalThis`, exposes `resetCounters()`.
- `package-config.ts` exposes `modifyPackageConfig()` / `resetPackageConfig()`.

## Testing (Jest, `jest/tests/`)
- Tests live in `jest/tests/<area>/<name>.test.ts`; mirror the source folder.
- Transpiled via Babel (`preset-env` node:current + `preset-typescript` +
  `transform-import-meta`).
- Mock config by mocking the boundary, not the subject:
  `jest.mock( '../../../helpers/package-config.js', () => ({ ...jest.requireActual(...), getPackageConfig: () => (...) }) )`.
- Reset shared state in `beforeEach` (e.g. `resetCounters()`).
- `.pcss/.css` imports are stubbed via `identity-obj-proxy`; `$src/*` maps to the
  consumer's `src/`.
- `eslint.config.mjs` ignores built `**/*.js` and `jest/fixtures|mocks`.

## Types
Shared utility types live in `types/utility.d.ts` (`AtLeast`, `Optional`,
`Require`, `OmitNever`, ...). Reuse them instead of re-deriving mapped types.
