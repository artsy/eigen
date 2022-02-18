import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import _ from "lodash"
import { Platform } from "react-native"
import { __globalStoreTestUtils__ } from "./GlobalStore"
import { CURRENT_APP_VERSION, migrate, Versions } from "./migration"
import { sanitize } from "./persistence"

jest.mock("lib/NativeModules/LegacyNativeModules", () => ({
  LegacyNativeModules: {
    ...jest.requireActual("lib/NativeModules/LegacyNativeModules").LegacyNativeModules,
    ARNotificationsManager: {
      ...jest.requireActual("lib/NativeModules/LegacyNativeModules").LegacyNativeModules
        .ARNotificationsManager,
      nativeState: {
        userAgent: "Jest Unit Tests",
        authenticationToken: null,
        onboardingState: "none",
        launchCount: 1,
        deviceId: "testDevice",
        userID: null,
        userEmail: null,
      },
    },
  },
}))

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
    }).toThrowErrorMatchingInlineSnapshot(`"Bad state.version {\\"version\\":\\"0\\"}"`)
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
    LegacyNativeModules.ARNotificationsManager.nativeState = {
      userAgent: "Jest Unit Tests",
      authenticationToken: null as any,
      launchCount: 1,
      deviceId: "testDevice",
      userID: null as any,
      userEmail: null as any,
    }

    __globalStoreTestUtils__?.reset()
    expect(migrate({ state: { version: 0 } })).toEqual(
      sanitize(__globalStoreTestUtils__?.getCurrentState())
    )
  })

  it("CURRENT_APP_VERSION is always the latest one", () => {
    expect(CURRENT_APP_VERSION).toBe(_.max(Object.values(Versions)))
  })

  it("Versions list starts from `1` and increases by `1`", () => {
    expect(_.min(Object.values(Versions))).toBe(1)
    expect(Object.values(Versions).sort((a, b) => a - b)).toStrictEqual(
      _.range(1, Object.values(Versions).length + 1)
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
    LegacyNativeModules.ARNotificationsManager.nativeState = {
      authenticationToken: "authenticationToken",
      onboardingState: "complete",
      userID: "userID",
    } as any
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

describe("App version Versions.StartDarkModeSupport", () => {
  const migrationToTest = Versions.StartDarkModeSupport

  it("adds darkMode default", () => {
    const previousState = migrate({
      state: { version: 0 },
      toVersion: migrationToTest - 1,
    }) as any

    const migratedState = migrate({
      state: previousState,
      toVersion: migrationToTest,
    }) as any

    expect(migratedState.settings.darkModeSyncWithSystem).toEqual(false)
    expect(migratedState.settings.darkModeForceMode).toEqual("light")
  })
})
