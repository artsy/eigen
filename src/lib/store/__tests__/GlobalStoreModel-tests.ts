import Cookies from "@react-native-cookies/cookies"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__, GlobalStore } from "../GlobalStore"
import { CURRENT_APP_VERSION } from "../migration"

describe("GlobalStoreModel", () => {
  it("has a version", () => {
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

    expect(__globalStoreTestUtils__?.getCurrentState().search.recentSearches[0].props.displayLabel).toEqual("Banksy")
  })

  it("can be manipulated", () => {
    // Here we will be using `testStuff` that doesn't exist, but it is safe to test with this.
    // We don't have any other simple thing that we can test with.

    GlobalStore.actions.__manipulate((store) => {
      // @ts-expect-error
      store.sessionState.testStuff = ["wow", 8]
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual(["wow", 8])

    GlobalStore.actions.rehydrate({
      sessionState: {
        // @ts-expect-error
        testStuff: ["new stuff!"],
      },
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual(["new stuff!"])

    GlobalStore.actions.rehydrate({
      sessionState: {
        // @ts-expect-error
        testStuff: ["wow", "once again"],
      },
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual(["wow", "once again"])

    GlobalStore.actions.__manipulate((store) => {
      // @ts-expect-error
      store.sessionState.testStuff = []
    })
    // @ts-expect-error
    expect(__globalStoreTestUtils__?.getCurrentState().sessionState.testStuff).toStrictEqual([])
  })

  it("has a signOut action", async () => {
    __globalStoreTestUtils__?.injectState({
      sessionState: { isHydrated: true },
      auth: {
        userAccessToken: "user-access-token",
        userID: "user-id",
      },
    })
    expect(Cookies.clearAll).not.toHaveBeenCalled()
    expect(LegacyNativeModules.ARTemporaryAPIModule.clearUserData).not.toHaveBeenCalled()
    expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe("user-access-token")
    await GlobalStore.actions.signOut()
    expect(__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken).toBe(null)
    expect(LegacyNativeModules.ARTemporaryAPIModule.clearUserData).toHaveBeenCalledTimes(1)
    expect(Cookies.clearAll).toHaveBeenCalledTimes(1)
  })
})
