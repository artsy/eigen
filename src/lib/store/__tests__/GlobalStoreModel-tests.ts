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
})
