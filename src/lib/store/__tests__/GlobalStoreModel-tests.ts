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
    GlobalStore.actions.__manipulate((store) => {
      store.config.echo.state.killedVersions = {
        ios: {},
        android: {},
      }
    })
    expect(__globalStoreTestUtils__?.getCurrentState().config.echo.state.killedVersions).toStrictEqual({
      ios: {},
      android: {},
    })

    GlobalStore.actions.rehydrate({
      config: {
        echo: {
          state: {
            killedVersions: {
              ios: { "1.2.3": { message: "update the app" } },
              android: {},
            },
          },
        },
      },
    })
    expect(__globalStoreTestUtils__?.getCurrentState().config.echo.state.killedVersions).toStrictEqual({
      ios: { "1.2.3": { message: "update the app" } },
      android: {},
    })

    GlobalStore.actions.rehydrate({
      config: {
        echo: {
          state: {
            killedVersions: {
              ios: { "1.2.5": { message: "update the app" } },
              android: { "1.2.4": { message: "update the app" } },
            },
          },
        },
      },
    })
    expect(__globalStoreTestUtils__?.getCurrentState().config.echo.state.killedVersions).toStrictEqual({
      ios: { "1.2.3": { message: "update the app" }, "1.2.5": { message: "update the app" } },
      android: { "1.2.4": { message: "update the app" } },
    })

    GlobalStore.actions.__manipulate((store) => {
      store.config.echo.state.killedVersions = {
        ios: {},
        android: {},
      }
    })
    expect(__globalStoreTestUtils__?.getCurrentState().config.echo.state.killedVersions).toStrictEqual({
      ios: {},
      android: {},
    })
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
