// easy-peasy ships with a fork of immer so let's use that instead of adding another copy of immer to our bundle.
import { produce } from "immer-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { echoLaunchJson } from "lib/utils/jsonFiles"
import { Platform } from "react-native"

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
  AddUserIsDev: 9,
  AddAuthOnboardingState: 10,
  RenameUserEmail: 11,
  AddToastModel: 12,
  PendingPushNotification: 13,
  CopyIOSNativeSessionAuthToTS: 14,
  AddExperimentsModel: 15,
  AddPreviousSessionUserID: 16,
  RemoveNativeOnboardingState: 17,
  AddUserPreferences: 18,
  AddVisualClueModel: 19,
  AddArtworkSubmissionModel: 20,
  AddArtworkViewOption: 21,
  StartDarkModeSupport: 22,
}

export const CURRENT_APP_VERSION = Versions.StartDarkModeSupport

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
    state.config.echoState = echoLaunchJson()
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
  [Versions.AddUserIsDev]: (state) => {
    state.auth.androidUserEmail = null
    state.config.userIsDev = { flipValue: false }
  },
  [Versions.AddAuthOnboardingState]: (state) => {
    state.auth.onboardingState = "none"
  },
  [Versions.RenameUserEmail]: (state) => {
    if (Platform.OS === "ios") {
      state.auth.userEmail = LegacyNativeModules.ARTemporaryAPIModule.getUserEmail()
    }
    if (Platform.OS === "android") {
      state.auth.userEmail = state.auth.androidUserEmail
    }
    state.auth.userEmail = state.auth.userEmail ?? null
    delete state.auth.androidUserEmail
  },
  [Versions.AddToastModel]: (state) => {
    state.toast = {}
  },
  [Versions.PendingPushNotification]: (state) => {
    state.pendingPushNotification = { notification: null }
  },
  [Versions.CopyIOSNativeSessionAuthToTS]: (state) => {
    if (Platform.OS === "ios") {
      const nativeState = LegacyNativeModules.ARNotificationsManager.nativeState
      state.auth.userAccessToken = nativeState.authenticationToken
      state.auth.onboardingState = (nativeState as any).onboardingState ?? "none"
      state.auth.userID = nativeState.userID
    }
  },
  [Versions.AddExperimentsModel]: (state) => {
    state.config.experiments = {}
  },
  [Versions.AddPreviousSessionUserID]: (state) => {
    state.auth.previousSessionUserID = null
  },
  [Versions.RemoveNativeOnboardingState]: (state) => {
    delete state.native.onboardingState
  },
  [Versions.AddUserPreferences]: (state) => {
    state.userPreferences = { currency: "USD", metric: "" }
  },
  [Versions.AddVisualClueModel]: (state) => {
    state.visualClue = {
      seenVisualClues: [],
    }
  },
  [Versions.AddArtworkSubmissionModel]: (state) => {
    state.artworkSubmission = {
      submission: {
        submissionId: "",
        artworkDetails: {
          artist: "",
          artistId: "",
          title: "",
          year: "",
          medium: "",
          attributionClass: null,
          editionNumber: "",
          editionSizeFormatted: "",
          dimensionsMetric: "in",
          height: "",
          width: "",
          depth: "",
          provenance: "",
          state: "DRAFT",
          utmMedium: "",
          utmSource: "",
          utmTerm: "",
          location: {
            city: "",
            state: "",
            country: "",
          },
        },
        photos: {
          photos: [],
        },
      },
    }
  },
  [Versions.AddArtworkViewOption]: (state) => {
    state.userPreferences.artworkViewOption = "grid"
  },
  [Versions.StartDarkModeSupport]: (state) => {
    state.settings = { darkModeSyncWithSystem: false, darkModeForceMode: "light" }
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
