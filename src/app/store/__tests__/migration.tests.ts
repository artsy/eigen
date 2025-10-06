import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { DEFAULT_VIEW_OPTION } from "app/Scenes/Search/UserPrefsModel"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { CURRENT_APP_VERSION, migrate, Versions } from "app/store/migration"
import { sanitize } from "app/store/persistence"
import { max, min, range } from "lodash"
import { Platform } from "react-native"

describe(migrate, () => {
  it("leaves an object untouched if there are no migrations pending", () => {
    const result = migrate({
      state: {
        version: 1,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: (s) => {
          s.value = "modified"
        },
      },
    })

    expect((result as any).value).toBe("untouched")
    expect(result.version).toBe(1)
  })

  it("applies a migration if there is one pending", () => {
    const result = migrate({
      state: {
        version: 0,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: (s) => {
          s.value = "modified"
        },
      },
    })

    expect((result as any).value).toBe("modified")
    expect(result.version).toBe(1)
  })

  it("applies many migrations if there are many pending", () => {
    const result = migrate({
      state: {
        version: 0,
      },
      toVersion: 4,
      migrations: {
        [0]: (s) => {
          s.zero = true
        },
        [1]: (s) => {
          s.one = true
        },
        [2]: (s) => {
          s.two = true
        },
        [3]: (s) => {
          s.three = true
        },
        [4]: (s) => {
          s.four = true
        },
        [5]: (s) => {
          s.five = true
        },
      },
    })

    expect((result as any).zero).toBe(undefined)
    expect((result as any).one).toBe(true)
    expect((result as any).two).toBe(true)
    expect((result as any).three).toBe(true)
    expect((result as any).four).toBe(true)
    expect((result as any).five).toBe(undefined)
    expect(result.version).toBe(4)
  })

  it("throws an error if there is no valid version", () => {
    expect(() => {
      migrate({
        state: {
          // @ts-ignore
          version: "0",
        },
        toVersion: 1,
        migrations: {
          [1]: (s) => {
            s.zero = true
          },
        },
      })
    }).toThrowErrorMatchingInlineSnapshot(`"Bad state.version {"version":"0"}"`)
  })

  it("throws an error if there is no valid migration", () => {
    expect(() => {
      migrate({
        state: {
          version: 0,
        },
        toVersion: 1,
        migrations: {
          [0]: (s) => {
            s.zero = true
          },
        },
      })
    }).toThrowErrorMatchingInlineSnapshot(`"No migrator found for app version 1"`)
  })

  it("guarantees that the version number ends up correct", () => {
    const result = migrate({
      state: {
        version: 0,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: (s) => {
          s.value = "modified"
          s.version = 5
        },
      },
    })

    expect((result as any).value).toBe("modified")
    expect(result.version).toBe(1)
  })
})

/**
 * Getting a failure in this test? You may need a migration.
 * See adding_state_migrations.md for more information.
 * Reach out to #product-mobile-experience with questions.
 */
describe("artsy app store migrations", () => {
  it("are up to date", () => {
    // Reset the nativeState to its original state
    ;(LegacyNativeModules.ARNotificationsManager.getConstants as jest.Mock).mockReturnValueOnce({
      userAgent: "Jest Unit Tests",
      authenticationToken: null as any,
      launchCount: 1,
      userID: null as any,
      userEmail: null as any,
    })
    __globalStoreTestUtils__?.reset()

    expect(migrate({ state: { version: 0 } })).toEqual(
      sanitize(__globalStoreTestUtils__?.getCurrentState())
    )
  })

  it("CURRENT_APP_VERSION is always the latest one", () => {
    expect(CURRENT_APP_VERSION).toBe(max(Object.values(Versions)))
  })

  it("Versions list starts from `1` and increases by `1`", () => {
    expect(min(Object.values(Versions))).toBe(1)
    expect(Object.values(Versions).sort((a, b) => a - b)).toStrictEqual(
      range(1, Object.values(Versions).length + 1)
    )
  })
})

describe("App version Versions.RenameConsingmentsToMyCollections", () => {
  const migrationToTest = Versions.RenameConsignmentsToMyCollection
  it("renames `consignments` to `myCollection`", () => {
    const previousState = migrate({ state: { version: 0 }, toVersion: migrationToTest - 1 })
    expect("consignments" in previousState).toBe(true)
    expect("myCollection" in previousState).toBe(false)

    const migratedState = migrate({ state: previousState, toVersion: migrationToTest })
    expect("consignments" in migratedState).toBe(false)
    expect("myCollection" in migratedState).toBe(true)
  })
})

describe("App version Versions.RemoveMyCollectionNavigationState", () => {
  const migrationToTest = Versions.RemoveMyCollectionNavigationState
  it("deletes `myCollection.navigation`", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any
    expect("navigation" in previousState.myCollection).toBe(true)

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any
    expect("navigation" in migratedState.myCollection).toBe(false)
  })
})

describe("App version Versions.RefactorConfigModel", () => {
  const migrationToTest = Versions.RefactorConfigModel
  it("moves the feature flag overrides and echo state to their own models", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    previousState.config.adminFeatureFlagOverrides = { MySpecialFlag: true }
    previousState.config.echoState = { created_at: "yesterday" }

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.config.features.adminOverrides).toEqual({ MySpecialFlag: true })
    expect(migratedState.config.echo.state).toEqual({ created_at: "yesterday" })
  })
})

describe("App version Versions.AddUserIsDev", () => {
  const migrationToTest = Versions.AddUserIsDev
  it("adds userEmail and userIsDev", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.androidUserEmail).toEqual(null)
    expect(migratedState.config.userIsDev.flipValue).toEqual(false)
  })
})

describe("App version Versions.AddAuthOnboardingState", () => {
  const migrationToTest = Versions.AddAuthOnboardingState
  it("adds onboardingState to auth model", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.onboardingState).toEqual("none")
  })
})

describe("App version Versions.RenameUserEmail", () => {
  const migrationToTest = Versions.RenameUserEmail
  it("moves androidUserEmail to userEmail for android", () => {
    Platform.OS = "android"
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    previousState.auth.androidUserEmail = "user@android.com"

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.androidUserEmail).toEqual(undefined)
    expect(migratedState.auth.userEmail).toEqual("user@android.com")
  })

  it("moves androidUserEmail to userEmail for ios", () => {
    Platform.OS = "ios"
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    previousState.native.sessionState = { userEmail: "user@ios.com" }

    LegacyNativeModules.ARTemporaryAPIModule.getUserEmail = jest.fn(
      () => previousState.native.sessionState.userEmail
    )
    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.userEmail).toEqual("user@ios.com")
  })
})

describe("App version Versions.AddToastModel", () => {
  const migrationToTest = Versions.AddToastModel
  it("adds session toast storage", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.toast).toEqual({})
  })
})

describe("PendingPushNotification migration", () => {
  const migrationToTest = Versions.PendingPushNotification
  it("adds pendingPushNotification to store", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.pendingPushNotification).toEqual({ notification: null })
  })
})

describe("CopyIOSNativeSessionAuthToTS migration", () => {
  beforeAll(() => {
    ;(LegacyNativeModules.ARNotificationsManager.getConstants as jest.Mock).mockReturnValueOnce({
      userAgent: "Jest Unit Tests",
      authenticationToken: "authenticationToken",
      launchCount: 1,
      userID: "userID",
      userEmail: "some@email.com",
      onboardingState: "complete",
    })
  })

  const migrationToTest = Versions.CopyIOSNativeSessionAuthToTS

  it("populates authentication details into the auth model", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.userAccessToken).toEqual("authenticationToken")
    expect(migratedState.auth.onboardingState).toEqual("complete")
    expect(migratedState.auth.userID).toEqual("userID")
  })
})

describe("AddExperimentsModel migration", () => {
  const migrationToTest = Versions.AddExperimentsModel

  it("adds the ExperimentsModel to the config Model", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.config.experiments).toEqual({})
  })
})

describe("App version Versions.AddPreviousSessionUserID", () => {
  const migrationToTest = Versions.AddPreviousSessionUserID
  it("adds previousSessionUserID", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    expect("previousSessionUserID" in previousState.auth).toBe(false)

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect("previousSessionUserID" in migratedState.auth).toBe(true)
    expect(migratedState.auth.previousSessionUserID).toEqual(null)
  })
})

describe("App version Versions.RemoveNativeOnboardingState", () => {
  const migrationToTest = Versions.RemoveNativeOnboardingState

  it("is not there afterwards", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.native.onboardingState).toEqual(undefined)
  })
})

describe("App version Versions.AddUserPreferences", () => {
  const migrationToTest = Versions.AddUserPreferences

  it("adds UserPreferences to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.userPreferences).toEqual({ currency: "USD", metric: "" })
  })
})

describe("App version Versions.AddArtworkSubmissionModel", () => {
  const migrationToTest = Versions.AddArtworkSubmissionModel

  it("adds artworkSubmission details to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artworkSubmission.submission.submissionId).toEqual("")
    expect(migratedState.artworkSubmission.submission.artworkDetails).toEqual({
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
    })
    expect(migratedState.artworkSubmission.submission.photos).toEqual({
      photos: [],
    })
  })
})

describe("App version Versions.AddArtworkViewOption", () => {
  const migrationToTest = Versions.AddArtworkViewOption

  it("adds viewOption details to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.userPreferences.artworkViewOption).toEqual("grid")
  })
})

describe("App version Versions.RenameModelsAndAddDarkModeSupport", () => {
  const migrationToTest = Versions.RenameModelsAndAddDarkModeSupport

  it("adds darkMode default", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    // just checking some things that they exist, then checking the same things later to make sure we moved them correctly
    expect(previousState.config.echo.state.name).toEqual("eigen")
    const prevConfig = previousState.config

    expect(previousState.userPreferences.artworkViewOption).toEqual("grid")
    const prevUserPreferences = previousState.userPreferences

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.devicePrefs.usingSystemColorScheme).toEqual(false)
    expect(migratedState.devicePrefs.forcedColorScheme).toEqual("light")

    expect(migratedState.config).toEqual(undefined)
    expect(migratedState.artsyPrefs.echo.state.name).toEqual("eigen")
    expect(migratedState.artsyPrefs).toEqual(prevConfig)

    expect(migratedState.userPreferences).toEqual(undefined)
    expect(migratedState.userPrefs.artworkViewOption).toEqual("grid")
    expect(migratedState.userPrefs).toEqual(prevUserPreferences)
  })
})

describe("App version Versions.AddUserPrefsMetricsUnit", () => {
  const migrationToTest = Versions.AddUserPrefsMetricsUnit

  it("adds default value for UserPrefs Metric unit to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.userPrefs.metric).toEqual("in")
  })
})

describe("App version Versions.AddSourceAndMyCollectionArtworkIDToSubmission", () => {
  const migrationToTest = Versions.AddSourceAndMyCollectionArtworkIDToSubmission

  it("adds source and myCollectionArtworkID to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artworkSubmission.submission.artworkDetails.source).toEqual(null)
    expect(migratedState.artworkSubmission.submission.artworkDetails.myCollectionArtworkID).toEqual(
      null
    )
  })
})

describe("RequestedPriceEstimates migration", () => {
  const migrationToTest = Versions.RequestedPriceEstimates

  it("adds RequestedPriceEstimates to the store", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.requestedPriceEstimates.requestedPriceEstimates).toEqual({})
  })
})

describe("App version Versions.AddSourceInitialPhotosToSubmission", () => {
  const migrationToTest = Versions.AddSourceInitialPhotosToSubmission

  it("adds source and initial photos to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artworkSubmission.submission.photos.initialPhotos).toEqual([])
  })
})

describe("App version Versions.AddZipCodeAndCountryCodeInSubmissionArtworkDetails", () => {
  const migrationToTest = Versions.AddZipCodeAndCountryCodeInSubmissionArtworkDetails

  it("adds zipCode and countryCode to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    expect(previousState.artworkSubmission.submission.artworkDetails.location.zipCode).toEqual(
      undefined
    )
    expect(previousState.artworkSubmission.submission.artworkDetails.location.countryCode).toEqual(
      undefined
    )

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artworkSubmission.submission.artworkDetails.location.zipCode).toEqual("")
    expect(migratedState.artworkSubmission.submission.artworkDetails.location.countryCode).toEqual(
      ""
    )
  })
})

describe("App version Versions.AddDirtyFormValuesToSubmissionState", () => {
  const migrationToTest = Versions.AddDirtyFormValuesToSubmissionState

  it("adds dirty artwork details values to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artworkSubmission.submission.dirtyArtworkDetailsValues).toEqual({
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
    })
  })
})

describe("App version Versions.RemoveDeviceId", () => {
  const migrationToTest = Versions.RemoveDeviceId

  it("removes deviceId", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    // this test is kinda unnecessary, since `native` is not really possible to test without actually testing the native code.
    // but i guess good to just make sure of the undefined, in case we ever break this somehow.
    expect(migratedState.native.deviceId).toBe(undefined)
  })
})

describe("App version Versions.AddSubmissionIdForMyCollection", () => {
  const migrationToTest = Versions.AddSubmissionIdForMyCollection

  it("removes deviceId", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artworkSubmission.submission.submissionIdForMyCollection).toEqual("")
  })
})

describe("App version Versions.AddRecentPriceRangesModel", () => {
  const migrationToTest = Versions.AddRecentPriceRangesModel

  it("adds recentPriceRanges to the store", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.recentPriceRanges.ranges).toEqual([])
  })
})

describe("App version Versions.AddUserPreferredPriceRange", () => {
  const migrationToTest = Versions.AddUserPreferredPriceRange

  it("adds priceRange details to state", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.userPrefs.priceRange).toEqual("*-*")
  })
})

describe("App version Versions.RenameAdminToLocalOverridesForFeatures", () => {
  const migrationToTest = Versions.RenameAdminToLocalOverridesForFeatures

  it("adds renames things correctly", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    expect(previousState.artsyPrefs.features.adminOverrides).toEqual({})
    previousState.artsyPrefs.features.adminOverrides = { testKey: true }
    expect(previousState.artsyPrefs.features.adminOverrides).toEqual({ testKey: true })

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artsyPrefs.features.localOverrides).toEqual({ testKey: true })
    expect(migratedState.artsyPrefs.features.adminOverrides).toEqual(undefined)
  })
})

describe("App version Versions.MoveEnvironmentToDevicePrefsAndRenameAdminToLocal", () => {
  const migrationToTest = Versions.MoveEnvironmentToDevicePrefsAndRenameAdminToLocal

  it("moves and renames things correctly", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    expect(previousState.artsyPrefs.environment.adminOverrides).toEqual({})
    previousState.artsyPrefs.environment.adminOverrides = { testKey: true }
    expect(previousState.artsyPrefs.environment.adminOverrides).toEqual({ testKey: true })

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.devicePrefs.environment.localOverrides).toEqual({ testKey: true })
    expect(migratedState.devicePrefs.environment.adminOverrides).toEqual(undefined)
    expect(migratedState.artsyPrefs.environment).toEqual(undefined)
  })
})

describe("App version Versions.AddOnboardingArtQuizStateToAuthModel", () => {
  const migrationToTest = Versions.AddOnboardingArtQuizStateToAuthModel

  it("removes deviceId", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.onboardingArtQuizState).toEqual("none")
  })
})

describe("App version Versions.AddPushPromptStateToAuthModel", () => {
  const migrationToTest = Versions.AddPushPromptStateToAuthModel

  it("adds requestedPushPermissionsThisSession to the auth model", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    })

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.requestedPushPermissionsThisSession).toEqual(false)
  })
})

describe("App version Versions.AddUserPreferredArtistsView", () => {
  const migrationToTest = Versions.AddUserPreferredArtistsView

  it("adds artist view option to user prefs model", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    })

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.userPrefs.artistViewOption).toEqual(DEFAULT_VIEW_OPTION)
  })
})

describe("App version Versions.AddPushPromptLogicModel", () => {
  const migrationToTest = Versions.AddPushPromptLogicModel

  it("removes requestedPushPermissionsThisSession from the auth model", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    })

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.auth.requestedPushPermissionsThisSession).toBe(undefined)
  })

  it("adds correct initial settings to push prompt logic ", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    })

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.artsyPrefs.pushPromptLogic).toEqual({
      pushNotificationSystemDialogRejected: false,
      pushNotificationDialogLastSeenTimestamp: null,
      pushNotificationSettingsPromptSeen: false,
      pushNotificationSystemDialogSeen: false,
      pushPermissionsRequestedThisSession: false,
    })
  })
})

describe("App version Versions.AddProgressiveOnboardingModel", () => {
  const migrationToTest = Versions.AddProgressiveOnboardingModel

  it("migrates visualClue.seenVisualClues to dismissed", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any
    previousState.visualClue.seenVisualClues = ["visual-clue-a", "visual-clue-b"]

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.progressiveOnboarding).toEqual({
      dismissed: [
        expect.objectContaining({ key: "visual-clue-a" }),
        expect.objectContaining({ key: "visual-clue-b" }),
      ],
    })
  })

  describe("App version Versions.AddNewWorksForYouViewOptionState", () => {
    const migrationToTest = Versions.AddNewWorksForYouViewOptionState

    it("adds newWorksForYouViewOption to the UserPrefs model as list", () => {
      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.userPrefs.newWorksForYouViewOption).toEqual("list")
    })
  })

  describe("App version Versions.RenameDefaultViewOption", () => {
    const migrationToTest = Versions.RenameDefaultViewOption

    it("renames newWorksForYouViewOption to defaultViewOption", () => {
      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      expect(previousState.userPrefs.newWorksForYouViewOption).toEqual("list")
      expect(previousState.userPrefs.defaultViewOption).toEqual(undefined)

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.userPrefs.newWorksForYouViewOption).toEqual(undefined)
      expect(migratedState.userPrefs.defaultViewOption).toEqual("list")
    })
  })

  describe("App version Versions.AddExperimentsOverrides", () => {
    const migrationToTest = Versions.AddExperimentsOverrides

    it("adds empty localPayloadOverrides and localVariantsOverrides objects", () => {
      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      expect(previousState.artsyPrefs.experiments.localPayloadOverrides).toEqual(undefined)
      expect(previousState.artsyPrefs.experiments.localPayloadOverrides).toEqual(undefined)

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.artsyPrefs.experiments.localPayloadOverrides).toEqual({})
      expect(migratedState.artsyPrefs.experiments.localPayloadOverrides).toEqual({})
    })
  })

  describe("App version Versions.DeleteDirtyArtworkDetails", () => {
    const migrationToTest = Versions.DeleteDirtyArtworkDetails

    it("removes dirtyArtworkDetailsValues object", () => {
      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      expect(previousState.artworkSubmission.submission.dirtyArtworkDetailsValues).toEqual({
        artist: "",
        artistId: "",
        attributionClass: null,
        category: null,
        depth: "",
        dimensionsMetric: "in",
        editionNumber: "",
        editionSizeFormatted: "",
        height: "",
        location: {
          city: "",
          state: "",
          country: "",
          countryCode: "",
          zipCode: "",
        },
        medium: "",
        myCollectionArtworkID: null,
        provenance: "",
        source: null,
        state: "DRAFT",
        utmMedium: "",
        utmSource: "",
        utmTerm: "",
        width: "",
        title: "",
        year: "",
      })

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.artworkSubmission.submission.dirtyArtworkDetailsValues).toEqual(
        undefined
      )
    })
  })

  describe("App version Versions.AddSubmissionDraft", () => {
    const migrationToTest = Versions.AddSubmissionDraft

    it("adds submission to my collection artwork", () => {
      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      expect(previousState.artworkSubmission.draft).not.toBeDefined()

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.artworkSubmission.draft).toEqual(null)
    })
  })

  describe("App version Versions.DeleteArtworkAndArtistViewOption", () => {
    const migrationToTest = Versions.DeleteArtworkAndArtistViewOption

    it("removes artworkViewOption and artistViewOption objects", () => {
      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.artworkSubmission.submission.artworkViewOption).toEqual(undefined)

      expect(migratedState.artworkSubmission.submission.artistViewOption).toEqual(undefined)
    })
  })
})

describe("App version Versions.AddInfiniteDiscoveryModel", () => {
  it("adds infiniteScrolling to the UserPrefs model", () => {
    const migrationToTest = Versions.AddInfiniteDiscoveryModel

    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.infiniteDiscovery).toEqual({
      discoveredArtworkIds: [],
    })
  })

  describe("App version Versions.MoveOnboardingStateToOnboardingModel", () => {
    it("moves onboardingState and onboardingArtQuizState to the Onboarding model", () => {
      const migrationToTest = Versions.MoveOnboardingStateToOnboardingModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      previousState.auth.onboardingState = "incomplete"
      previousState.auth.onboardingArtQuizState = "none"

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.auth.onboardingState).toEqual(undefined)
      expect(migratedState.auth.onboardingArtQuizState).toEqual(undefined)

      expect(migratedState.onboarding.onboardingState).toEqual("incomplete")
      expect(migratedState.onboarding.onboardingArtQuizState).toEqual("none")
    })
  })

  describe("App version Versions.AddSavedArtworksCountToInfiniteDiscoveryModel", () => {
    it("adds savedArtworksCount to the InfiniteDiscovery model", () => {
      const migrationToTest = Versions.AddSavedArtworksCountToInfiniteDiscoveryModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      previousState.infiniteDiscovery.discoveredArtworkIds = ["artwork-1", "artwork-2"]

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.infiniteDiscovery.discoveredArtworkIds).toEqual([
        "artwork-1",
        "artwork-2",
      ])
      expect(migratedState.infiniteDiscovery.savedArtworksCount).toEqual(0)
    })
  })

  describe("App version Versions.RemoveArworkSubmissionModel", () => {
    it("Remove artworkSubmission model", () => {
      const migrationToTest = Versions.RemoveArworkSubmissionModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      previousState.artworkSubmission = {
        submission: {
          submissionId: "submission-id",
        },
      }

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.artworkSubmission).toEqual(undefined)
    })
  })

  describe("App version Versions.RemoveRequestPriceEstimateModel", () => {
    it("remove requestedPriceEstimates model", () => {
      const migrationToTest = Versions.RemoveRequestPriceEstimateModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      previousState.requestedPriceEstimates = {
        requestedPriceEstimates: {
          id: {
            artworkId: "id",
            requestedAt: "random-value",
          },
        },
      }

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.requestedPriceEstimates).toEqual(undefined)
    })
  })

  describe("App version Versions.RefactorDarkModeValues", () => {
    it("update dark mode store values", () => {
      const migrationToTest = Versions.RefactorDarkModeValues

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.devicePrefs.darkModeOption).toEqual("system")
      expect(migratedState.devicePrefs.usingSystemColorScheme).toEqual(undefined)
      expect(migratedState.devicePrefs.forcedColorScheme).toEqual(undefined)
    })
  })

  describe("App version Versions.RemoveDiscoveredArtworkIdsFromInfiniteDiscoveryModel", () => {
    it("removes discoveredArtworkIds from infiniteDiscovery model", () => {
      const migrationToTest = Versions.RemoveDiscoveredArtworkIdsFromInfiniteDiscoveryModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      previousState.infiniteDiscovery.discoveredArtworkIds = ["artwork-1", "artwork-2"]

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.infiniteDiscovery.discoveredArtworkIds).toBeUndefined()
    })
  })

  describe("App version Versions.AddNewWorksForYouArtworkIDsModel", () => {
    it("adds hasSeenOnboarding as false", () => {
      const migrationToTest = Versions.AddHasIntereactedWithOnboardingToInfiniteDiscoveryModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(previousState.infiniteDiscovery.hasInteractedWithOnboarding).toEqual(undefined)
      expect(migratedState.infiniteDiscovery.hasInteractedWithOnboarding).toEqual(false)
    })
  })
  describe("AddHasSavedArtworksToInfiniteDiscoveryModel", () => {
    it("should add hasSavedArtworks as false", () => {
      const migrationToTest = Versions.AddHasSavedArtworksToInfiniteDiscoveryModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(previousState.infiniteDiscovery.hasSavedArtworks).toEqual(undefined)
      expect(migratedState.infiniteDiscovery.hasSavedArtworks).toEqual(false)
    })
  })
  describe("App version Versions.AddPreviouslySelectedCitySlugToUserPrefsModel", () => {
    it("should add previouslySelectedCitySlug as null", () => {
      const migrationToTest = Versions.AddPreviouslySelectedCitySlugToUserPrefsModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(previousState.userPrefs.previouslySelectedCitySlug).toEqual(undefined)
      expect(migratedState.userPrefs.previouslySelectedCitySlug).toEqual(null)
    })
  })
  describe("App version Versions.RemovePendingPushNotificationModel", () => {
    it("should remove pendingPushNotification from store", () => {
      const migrationToTest = Versions.RemovePendingPushNotificationModel

      const previousState = migrate({
        state: { version: 0 },
        toVersion: migrationToTest - 1,
      }) as any

      expect(previousState.pendingPushNotification.notification).toEqual(null)

      const migratedState = migrate({
        state: previousState,
        toVersion: migrationToTest,
      }) as any

      expect(migratedState.pendingPushNotification).toEqual(undefined)
    })
  })
})
