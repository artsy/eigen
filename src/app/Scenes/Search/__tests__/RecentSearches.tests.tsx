import { act, screen } from "@testing-library/react-native"
import { RecentSearches } from "app/Scenes/Search/RecentSearches"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { RecentSearch } from "app/Scenes/Search/SearchModel"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
  <SearchContext.Provider
    value={{ inputRef: { current: null } as any, queryRef: { current: null } }}
  >
    <RecentSearches />
  </SearchContext.Provider>
)

describe("Recent Searches", () => {
  it("has an empty state", () => {
    renderWithWrappers(<TestPage />)

    expect(screen.getByText("We’ll save your recent searches here")).toBeOnTheScreen()
  })

  it("shows recent searches if there were any", () => {
    renderWithWrappers(<TestPage />)

    act(() => {
      GlobalStore.actions.search.addRecentSearch(banksy)
    })

    expect(screen.getByText("Banksy")).toBeOnTheScreen()

    act(() => {
      GlobalStore.actions.search.addRecentSearch(andyWarhol)
    })

    expect(screen.getByText("Banksy")).toBeOnTheScreen()
  })

  it("shows all recent searches", () => {
    renderWithWrappers(<TestPage />)

    act(() => {
      GlobalStore.actions.search.addRecentSearch(banksy)
      GlobalStore.actions.search.addRecentSearch(andyWarhol)
      GlobalStore.actions.search.addRecentSearch(keithHaring)
      GlobalStore.actions.search.addRecentSearch(yayoiKusama)
      GlobalStore.actions.search.addRecentSearch(joanMitchell)
      GlobalStore.actions.search.addRecentSearch(anniAlbers)
    })

    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("Keith Haring")).toBeOnTheScreen()
    expect(screen.getByText("Yayoi Kusama")).toBeOnTheScreen()
    expect(screen.getByText("Joan Mitchell")).toBeOnTheScreen()
    expect(screen.getByText("Anni Albers")).toBeOnTheScreen()
  })
})
