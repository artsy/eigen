// easy-peasy ships with a fork of immer so let's use that instead of adding another copy of immer to our bundle.
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { DEFAULT_VIEW_OPTION } from "app/Scenes/Search/UserPrefsModel"
import { echoLaunchJson } from "app/utils/jsonFiles"
import { produce, setAutoFreeze } from "immer"
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
  RenameModelsAndAddDarkModeSupport: 22,
  AddUserPrefsMetricsUnit: 23,
  AddSourceAndMyCollectionArtworkIDToSubmission: 24,
  AddSourceInitialPhotosToSubmission: 25,
  RequestedPriceEstimates: 26,
  AddZipCodeAndCountryCodeInSubmissionArtworkDetails: 27,
  AddDirtyFormValuesToSubmissionState: 28,
  RemoveDeviceId: 29,
  AddSubmissionIdForMyCollection: 30,
  AddRecentPriceRangesModel: 31,
  AddUserPreferredPriceRange: 32,
  RenameAdminToLocalOverridesForFeatures: 33,
  MoveEnvironmentToDevicePrefsAndRenameAdminToLocal: 34,
  AddCategoryToSubmissionArtworkDetails: 35,
  AddOnboardingArtQuizStateToAuthModel: 36,
  AddPushPromptStateToAuthModel: 37,
  AddUserPreferredArtistsView: 38,
  AddPushPromptLogicModel: 39,
  AddProgressiveOnboardingModel: 40,
  AddNewWorksForYouViewOptionState: 41,
  RenameDefaultViewOption: 42,
  AddExperimentsOverrides: 43,
  DeleteDirtyArtworkDetails: 44,
  AddSubmissionDraft: 45,
  DeleteArtworkAndArtistViewOption: 46,
  AddInfiniteDiscoveryModel: 47,
  MoveOnboardingStateToOnboardingModel: 48,
  AddSavedArtworksCountToInfiniteDiscoveryModel: 49,
  RemoveArworkSubmissionModel: 50,
  RemoveRequestPriceEstimateModel: 51,
  RefactorDarkModeValues: 52,
  RemoveDiscoveredArtworkIdsFromInfiniteDiscoveryModel: 53,
  AddHasIntereactedWithOnboardingToInfiniteDiscoveryModel: 54,
  AddHasSavedArtworksToInfiniteDiscoveryModel: 55,
  AddPreviouslySelectedCitySlugToUserPrefsModel: 56,
}

export const CURRENT_APP_VERSION = Versions.AddPreviouslySelectedCitySlugToUserPrefsModel

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
      const nativeState = LegacyNativeModules.ARNotificationsManager.getConstants()

      state.auth.userAccessToken = nativeState?.authenticationToken
      state.auth.onboardingState = (nativeState as any).onboardingState ?? "none"
      state.auth.userID = nativeState?.userID
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
        photosForMyCollection: {
          photos: [],
        },
      },
    }
  },
  [Versions.AddArtworkViewOption]: (state) => {
    state.userPreferences.artworkViewOption = "grid"
  },
  [Versions.RenameModelsAndAddDarkModeSupport]: (state) => {
    state.artsyPrefs = state.config ?? {}
    state.userPrefs = state.userPreferences ?? {}
    state.devicePrefs = {
      usingSystemColorScheme: false,
      forcedColorScheme: "light",
    }
    delete state.config
    delete state.userPreferences
  },
  [Versions.AddUserPrefsMetricsUnit]: (state) => {
    state.userPrefs.metric = "in"
  },
  [Versions.AddSourceAndMyCollectionArtworkIDToSubmission]: (state) => {
    state.artworkSubmission.submission.artworkDetails.source = null
    state.artworkSubmission.submission.artworkDetails.myCollectionArtworkID = null
  },
  [Versions.AddSourceInitialPhotosToSubmission]: (state) => {
    state.artworkSubmission.submission.photos.initialPhotos = []
    state.artworkSubmission.submission.photosForMyCollection.initialPhotos = []
  },
  [Versions.RequestedPriceEstimates]: (state) => {
    state.requestedPriceEstimates = { requestedPriceEstimates: {} }
  },
  [Versions.AddZipCodeAndCountryCodeInSubmissionArtworkDetails]: (state) => {
    state.artworkSubmission.submission.artworkDetails.location.zipCode = ""
    state.artworkSubmission.submission.artworkDetails.location.countryCode = ""
  },
  [Versions.AddDirtyFormValuesToSubmissionState]: (state) => {
    state.artworkSubmission.submission.dirtyArtworkDetailsValues = {
      artist: "",
      artistId: "",
      title: "",
      year: "",
      medium: "",
      myCollectionArtworkID: null,
      attributionClass: null,
      editionNumber: "",
      editionSizeFormatted: "",
      dimensionsMetric: "in",
      height: "",
      width: "",
      depth: "",
      provenance: "",
      source: null,
      state: "DRAFT",
      utmMedium: "",
      utmSource: "",
      utmTerm: "",
      location: {
        city: "",
        state: "",
        country: "",
        countryCode: "",
        zipCode: "",
      },
    }
  },
  [Versions.RemoveDeviceId]: (state) => {
    delete state.native.deviceId
  },
  [Versions.AddSubmissionIdForMyCollection]: (state) => {
    state.artworkSubmission.submission.submissionIdForMyCollection = ""
  },
  [Versions.AddRecentPriceRangesModel]: (state) => {
    state.recentPriceRanges = {
      ranges: [],
    }
  },
  [Versions.AddUserPreferredPriceRange]: (state) => {
    state.userPrefs.priceRange = "*-*"
  },
  [Versions.RenameAdminToLocalOverridesForFeatures]: (state) => {
    state.artsyPrefs.features.localOverrides = state.artsyPrefs.features.adminOverrides
    delete state.artsyPrefs.features.adminOverrides
  },
  [Versions.MoveEnvironmentToDevicePrefsAndRenameAdminToLocal]: (state) => {
    state.devicePrefs.environment = state.artsyPrefs.environment
    delete state.artsyPrefs.environment
    state.devicePrefs.environment.localOverrides = state.devicePrefs.environment.adminOverrides
    delete state.devicePrefs.environment.adminOverrides
  },
  [Versions.AddCategoryToSubmissionArtworkDetails]: (state) => {
    state.artworkSubmission.submission.artworkDetails.category = null
    state.artworkSubmission.submission.dirtyArtworkDetailsValues.category = null
  },
  [Versions.AddOnboardingArtQuizStateToAuthModel]: (state) => {
    state.auth.onboardingArtQuizState = "none"
  },
  [Versions.AddPushPromptStateToAuthModel]: (state) => {
    state.auth.requestedPushPermissionsThisSession = false
  },
  [Versions.AddUserPreferredArtistsView]: (state) => {
    state.userPrefs.artistViewOption = DEFAULT_VIEW_OPTION
  },
  [Versions.AddPushPromptLogicModel]: (state) => {
    delete state.auth.requestedPushPermissionsThisSession
    state.artsyPrefs.pushPromptLogic = {
      pushNotificationSystemDialogRejected: false,
      pushNotificationDialogLastSeenTimestamp: null,
      pushNotificationSettingsPromptSeen: false,
      pushNotificationSystemDialogSeen: false,
      pushPermissionsRequestedThisSession: false,
    }
  },
  [Versions.AddProgressiveOnboardingModel]: (state) => {
    state.progressiveOnboarding = {
      dismissed: [
        ...state.visualClue.seenVisualClues.map((clue: string) => ({
          key: clue,
          timestamp: Date.now(),
        })),
      ],
    }
  },
  [Versions.AddNewWorksForYouViewOptionState]: (state) => {
    state.userPrefs.newWorksForYouViewOption = "list"
  },
  [Versions.RenameDefaultViewOption]: (state) => {
    state.userPrefs.defaultViewOption = state.userPrefs.newWorksForYouViewOption
    delete state.userPrefs.newWorksForYouViewOption
  },
  [Versions.AddExperimentsOverrides]: (state) => {
    state.artsyPrefs.experiments.localVariantOverrides = {}
    state.artsyPrefs.experiments.localPayloadOverrides = {}
  },
  [Versions.DeleteDirtyArtworkDetails]: (state) => {
    delete state.artworkSubmission.submission.dirtyArtworkDetailsValues
  },
  [Versions.AddSubmissionDraft]: (state) => {
    state.artworkSubmission.draft = null
  },
  [Versions.DeleteArtworkAndArtistViewOption]: (state) => {
    delete state.userPrefs.artworkViewOption
    delete state.userPrefs.artistViewOption
  },
  [Versions.AddInfiniteDiscoveryModel]: (state) => {
    state.infiniteDiscovery = {
      discoveredArtworkIds: [],
    }
  },
  [Versions.MoveOnboardingStateToOnboardingModel]: (state) => {
    state.onboarding = {
      onboardingState:
        state.auth.onboardingState === "none" ? "incomplete" : state.auth.onboardingState,
      onboardingArtQuizState: state.auth.onboardingArtQuizState,
    }
    delete state.auth.onboardingState
    delete state.auth.onboardingArtQuizState
  },
  [Versions.AddSavedArtworksCountToInfiniteDiscoveryModel]: (state) => {
    state.infiniteDiscovery.savedArtworksCount = 0
  },
  [Versions.RemoveArworkSubmissionModel]: (state) => {
    delete state.artworkSubmission
  },
  [Versions.RemoveRequestPriceEstimateModel]: (state) => {
    delete state.requestedPriceEstimates
  },
  [Versions.RefactorDarkModeValues]: (state) => {
    state.devicePrefs.darkModeOption = "system"
    delete state.devicePrefs.usingSystemColorScheme
    delete state.devicePrefs.forcedColorScheme
  },
  [Versions.RemoveDiscoveredArtworkIdsFromInfiniteDiscoveryModel]: (state) => {
    delete state.infiniteDiscovery.discoveredArtworkIds
  },
  [Versions.AddHasIntereactedWithOnboardingToInfiniteDiscoveryModel]: (state) => {
    state.infiniteDiscovery.hasInteractedWithOnboarding = false
  },
  [Versions.AddHasSavedArtworksToInfiniteDiscoveryModel]: (state) => {
    state.infiniteDiscovery.hasSavedArtworks = false
  },
  [Versions.AddPreviouslySelectedCitySlugToUserPrefsModel]: (state) => {
    state.userPrefs.previouslySelectedCitySlug = null
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
  setAutoFreeze(false)

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

  setAutoFreeze(true)
  return state
}
