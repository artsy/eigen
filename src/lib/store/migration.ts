// easy-peasy ships with a fork of immer so let's use that instead of adding another copy of immer to our bundle.
import { produce } from "immer-peasy"
import echoLaunchJSON from "../../../Artsy/App/EchoNew.json"

/**
 * IMPORTANT
 * Before you modify this file please read docs/adding_state_migrations.md
 */

export const Versions = {
  AddSearchesAndNativeAndBottomTabs: 1,
  AddConsignments: 2,
  RenameConsignmentsToMyCollection: 3,
  RemoveMyCollectionNavigationState: 4,
  AddAuthAndConfigState: 5,
  AddFeatureFlagInfra: 6,
  RefactorConfigModel: 7,
  FixEnvironmentMigrationBug: 8,
}

export const CURRENT_APP_VERSION = Versions.FixEnvironmentMigrationBug

export type Migrations = Record<number, (oldState: any) => any>
export const artsyAppMigrations: Migrations = {
  [Versions.AddSearchesAndNativeAndBottomTabs]: (_) => ({
    bottomTabs: {},
    native: {},
    search: { recentSearches: [] },
  }),
  [Versions.AddConsignments]: (state) => {
    state.consignments = {
      artwork: {},
      navigation: {},
    }
  },
  [Versions.RenameConsignmentsToMyCollection]: (state) => {
    state.myCollection = state.consignments
    delete state.consignments
  },
  [Versions.RemoveMyCollectionNavigationState]: (state) => {
    delete state.myCollection.navigation
  },
  [Versions.AddAuthAndConfigState]: (state) => {
    state.auth = {
      userID: null,
      userAccessToken: null,
      userAccessTokenExpiresIn: null,
      xAppToken: null,
      xApptokenExpiresIn: null,
    }
    state.config = {}
  },
  [Versions.AddFeatureFlagInfra]: (state) => {
    state.config.adminFeatureFlagOverrides = {}
    state.config.echoState = echoLaunchJSON
  },
  [Versions.RefactorConfigModel]: (state) => {
    const newConfig = {} as any
    newConfig.features = { adminOverrides: state.config.adminFeatureFlagOverrides }
    newConfig.echo = { state: state.config.echoState }
    newConfig.environment = { adminOverrides: {}, env: "staging" }
    state.config = newConfig
  },
  [Versions.FixEnvironmentMigrationBug]: (state) => {
    state.config.environment.env = __TEST__ ? "staging" : "production"
  },
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
