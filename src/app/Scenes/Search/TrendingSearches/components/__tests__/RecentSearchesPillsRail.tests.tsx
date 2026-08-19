import { act, fireEvent, screen } from "@testing-library/react-native"
import { RecentSearch } from "app/Scenes/Search/SearchModel"
import { RecentSearchesPillsRail } from "app/Scenes/Search/TrendingSearches/components/RecentSearchesPillsRail"
import { GlobalStore } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const [banksy, kaws]: RecentSearch[] = [
  ["Banksy", "banksy"],
  ["KAWS", "kaws"],
].map(([name, slug]) => ({
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: name,
    displayType: "Artist",
    href: `https://artsy.com/artist/${slug}`,
    imageUrl: "https://example.com/image.jpg",
    __typename: "Artist",
  },
}))

describe("RecentSearchesPillsRail", () => {
  beforeEach(() => {
    act(() => {
      GlobalStore.actions.search.clearRecentSearches()
    })
  })

  it("renders nothing when there are no recent searches", () => {
    renderWithWrappers(<RecentSearchesPillsRail />)

    expect(screen.queryByText("Recent Searches")).not.toBeOnTheScreen()
  })

  it("renders a pill per recent search", () => {
    renderWithWrappers(<RecentSearchesPillsRail />)

    act(() => {
      GlobalStore.actions.search.addRecentSearch(banksy)
      GlobalStore.actions.search.addRecentSearch(kaws)
    })

    expect(screen.getByText("Recent Searches")).toBeOnTheScreen()
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.getByText("KAWS")).toBeOnTheScreen()
  })

  it("removes a single search when its delete button is pressed", () => {
    renderWithWrappers(<RecentSearchesPillsRail />)

    act(() => {
      GlobalStore.actions.search.addRecentSearch(banksy)
      GlobalStore.actions.search.addRecentSearch(kaws)
    })

    fireEvent.press(screen.getByLabelText("Remove Banksy from recent searches"))

    expect(screen.queryByText("Banksy")).not.toBeOnTheScreen()
    expect(screen.getByText("KAWS")).toBeOnTheScreen()
  })

  it("clears all searches when the Clear action is pressed", () => {
    renderWithWrappers(<RecentSearchesPillsRail />)

    act(() => {
      GlobalStore.actions.search.addRecentSearch(banksy)
      GlobalStore.actions.search.addRecentSearch(kaws)
    })

    fireEvent.press(screen.getByText("Clear"))

    expect(screen.queryByText("Recent Searches")).not.toBeOnTheScreen()
    expect(screen.queryByText("Banksy")).not.toBeOnTheScreen()
    expect(screen.queryByText("KAWS")).not.toBeOnTheScreen()
  })
})
