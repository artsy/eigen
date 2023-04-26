/**
 * IMPORTANT
 * Before you modify this file please read docs/adding_state_migrations.md
 */

export const Versions = {
  MigrateToUpstreamPersistedState: 1,
}

export const CURRENT_APP_VERSION = Versions.MigrateToUpstreamPersistedState

export type Migrations = Record<number, (oldState: any) => any>

export const artsyAppMigrations: Migrations = {
  [Versions.MigrateToUpstreamPersistedState]: (state) => {
    state._migrationVersion = 1
  },
}
