import { __appStoreTestUtils__, AppStore } from "../AppStore"
import { CURRENT_APP_VERSION } from "../migration"

describe("AppStoreModel", () => {
  it("has a version", () => {
    expect(__appStoreTestUtils__?.getCurrentState().version).toBe(CURRENT_APP_VERSION)
  })
  it("can be rehydrated", () => {
    expect(__appStoreTestUtils__?.getCurrentState().search.recentSearches.length).toBe(0)
    AppStore.actions.rehydrate({
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

    expect(__appStoreTestUtils__?.getCurrentState().search.recentSearches[0].props.displayLabel).toEqual("Banksy")
  })
})
