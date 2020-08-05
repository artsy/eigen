import { produce } from "immer-peasy"
import { CURRENT_APP_VERSION } from "./AppStoreModel"

export type Migrations = Record<number, (oldState: any) => any>
/**
 * If you modify the app state in a backwards-incompatible way, i.e. one of
 *   - changing the structure of any object type which gets stored in arrays
 *   - removing a property from a model
 *   - changing a property's value type
 *   - renaming a property
 * you must bump `CURRENT_APP_VERSION` and add a migration for your new version number here
 * which makes the previous app state version compatible with your new version.
 *
 * e.g. if you rename the `bottomTabs` property to `navigation` in `AppStoreModel`, and the current app verion is 34,
 * you should bump it to 35 and then add a migration like
 *
 *    [35]: s => {
 *       s.navigation = s.bottomTabs
 *       delete s.bottomTabs
 *    }
 *
 * Note that modifying any state shapes within an existing `sessionState` field is _not_ a breaking change.
 *
 * Finally, please add a test for your migration in `migration-tests.ts`
 */
export const artsyAppMigrations: Migrations = {
  [0]: s => s,
}

export function migrate<State extends { version: number }>({
  state,
  migrations = artsyAppMigrations,
  toVersion = CURRENT_APP_VERSION,
}: {
  state: State
  migrations?: Migrations
  toVersion?: number
}): {
  version: number
} {
  if (typeof state.version !== "number") {
    throw new Error("Bad state.version " + JSON.stringify(state))
  }
  while (state.version < toVersion) {
    const nextVersion = state.version + 1
    const migrator = migrations[nextVersion]
    if (!migrator) {
      throw new Error("No migrator found for app version " + nextVersion)
    }
    state = produce(state, migrator)
    state.version = nextVersion
  }
  return state
}
