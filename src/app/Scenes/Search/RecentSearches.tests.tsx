import { screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { RecentSearches } from "./RecentSearches"
import { SearchContext } from "./SearchContext"
import { RecentSearch } from "./SearchModel"

const [banksy, andyWarhol, keithHaring, yayoiKusama, joanMitchell, anniAlbers] = [
  ["Banksy", "banksy"],
  ["Andy Warhol", "andy-warhol"],
  ["Keith Haring", "keith-haring"],
  ["Yayoi Kusama", "yayoi-kusama"],
  ["Joan Mitchell", "joan-mitchell"],
  ["Anni Albers", "anni-albers"],
].map(
  ([name, slug]): RecentSearch => ({
    type: "AUTOSUGGEST_RESULT_TAPPED",
    props: {
      displayLabel: name,
      displayType: "Artist",
      href: `https://artsy.com/artist/${slug}`,
      imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
      __typename: "Artist",
    },
  })
)

const TestPage = () => (
  <SearchContext.Provider value={{ inputRef: { current: null }, queryRef: { current: null } }}>
    <RecentSearches />
  </SearchContext.Provider>
)

describe("Recent Searches", () => {
  it("has an empty state", () => {
    renderWithWrappers(<TestPage />)

    expect(screen.queryByText("We’ll save your recent searches here")).toBeTruthy()
  })

  it("shows recent searches if there were any", () => {
    renderWithWrappers(<TestPage />)

    GlobalStore.actions.search.addRecentSearch(banksy)

    expect(screen.queryByText("Banksy")).toBeTruthy()

    GlobalStore.actions.search.addRecentSearch(andyWarhol)

    expect(screen.queryByText("Banksy")).toBeTruthy()
  })

  it("shows a maxiumum of 5 searches", () => {
    renderWithWrappers(<TestPage />)

    GlobalStore.actions.search.addRecentSearch(banksy)
    GlobalStore.actions.search.addRecentSearch(andyWarhol)
    GlobalStore.actions.search.addRecentSearch(keithHaring)
    GlobalStore.actions.search.addRecentSearch(yayoiKusama)
    GlobalStore.actions.search.addRecentSearch(joanMitchell)
    GlobalStore.actions.search.addRecentSearch(anniAlbers)

    expect(screen.queryByText("Banksy")).toBeNull()
    expect(screen.queryByText("Andy Warhol")).toBeTruthy()
    expect(screen.queryByText("Keith Haring")).toBeTruthy()
    expect(screen.queryByText("Yayoi Kusama")).toBeTruthy()
    expect(screen.queryByText("Joan Mitchell")).toBeTruthy()
    expect(screen.queryByText("Anni Albers")).toBeTruthy()
  })
})
