# Developer Workflows

**Toolchain:** Node `>=22.21` (`.nvmrc` = 22.21.1), Yarn Berry `4.17` with PnP.
Use `yarn`, never `npm`.

## Commands
- `yarn test` — Jest. Note the non-default config path:
  `jest --config ./jest/jest.config.ts`. Run a single file with
  `yarn test css-classnames`.
- `yarn lint` — `eslint --fix --cache` (config `@lipemat/eslint-config`).
- `yarn validate-ts` — `tsc --noEmit` type-check across the whole project.
- `yarn build` — `tsc --project ./bin`, emits `bin/*.js` + source maps.
- `yarn watch` — `tsc --project ./bin --watch`.
- `prepublishOnly` runs `build` automatically.

## After changing code
Run `yarn lint`, `yarn validate-ts`, and `yarn test`. When you touch anything in
`bin/`, also `yarn build` and commit the regenerated `.js`/`.map`.

## PnP note
`bin/fix-pnp.ts` patches `.pnp.*` to silence loose-module warnings; it is the
package's published `js-boilerplate-shared__fix-pnp` bin, not part of local dev.
