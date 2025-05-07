import {
  __globalStoreTestUtils__,
  getCurrentEmissionState,
  GlobalStore,
} from "app/store/GlobalStore"
import { CURRENT_APP_VERSION } from "app/store/migration"
import { pass } from "jest-extended"
import mockFetch from "jest-fetch-mock"

describe("GlobalStoreModel", () => {
  beforeEach(() => {
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
          "someValue"
        },
      } as any)
    )
  })

  afterEach(() => {
    mockFetch.mockClear()
  })

  it("has latest version on install", () => {
    expect(__globalStoreTestUtils__?.getCurrentState().version).toBe(CURRENT_APP_VERSION)
  })

  it("can be rehydrated", () => {
    expect(__globalStoreTestUtils__?.getCurrentState().search.recentSearches.length).toBe(0)
    GlobalStore.actions.rehydrate({
      search: {
        recentSearches: [
          {
            type: "AUTOSUGGEST_RESULT_TAPPED",
            props: {
              displayLabel: "Banksy",
              displayType: "Artist",
              href: "https://artsy.com/artist/banksy",
              imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
            },
          },
        ],
      },
    })
    expect(
      __globalStoreTestUtils__?.getCurrentState().search.recentSearches[0].props.displayLabel
    ).toEqual("Banksy")
  })

  it("returns expected user agent", () => {
    const userAgent = getCurrentEmissionState().userAgent
    if (!userAgent.includes("Artsy-Mobile")) {
      fail(`
        !!! The user agent for eigen has changed,
        this will break things elsewhere.
        If this is intended updates must be made outside eigen, see here:
        https://github.com/artsy/gravity/pull/17853
      `)
    } else {
      pass("User agent contains Artsy-Mobile")
    }
  })

  it("can be manipulated", () => {
    // Here we will be using `testStuff` that doesn't exist, but it is safe to test with this.
    // We don't have any other simple thing that we can test with.
    GlobalStore.actions.__manipulate((store) => {
      // @ts-expect-error
      store.sessionState.testStuff = ["wow", 8]
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual([
      "wow",
      8,
    ])
    GlobalStore.actions.rehydrate({
      sessionState: {
        // @ts-expect-error
        testStuff: ["new stuff!"],
      },
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual([
      "new stuff!",
    ])
    GlobalStore.actions.rehydrate({
      sessionState: {
        // @ts-expect-error
        testStuff: ["wow", "once again"],
      },
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual([
      "wow",
      "once again",
    ])
    GlobalStore.actions.__manipulate((store) => {
      // @ts-expect-error
      store.sessionState.testStuff = []
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual([])
  })
  it("can have feature flags changed/injected", () => {
    expect(
      __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.localOverrides
    ).toStrictEqual({})
    expect(
      __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.flags.ARDarkModeSupport
    ).toStrictEqual(true)
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: false })
    expect(
      __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.localOverrides
    ).toStrictEqual({ ARDarkModeSupport: false })
    expect(
      __globalStoreTestUtils__?.getCurrentState().artsyPrefs.features.flags.ARDarkModeSupport
    ).toStrictEqual(false)
  })
})
