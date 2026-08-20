import { screen } from "@testing-library/react-native"
import { useTrendingSearchesQuery } from "__generated__/useTrendingSearchesQuery.graphql"
import { TrendingSearches } from "app/Scenes/Search/TrendingSearches/TrendingSearches"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("@react-navigation/bottom-tabs", () => ({
  ...jest.requireActual("@react-navigation/bottom-tabs"),
  useBottomTabBarHeight: () => 0,
}))

const { renderWithRelay } = setupTestWrapper<useTrendingSearchesQuery>({
  Component: TrendingSearches,
})

describe("TrendingSearches", () => {
  it("renders trending artists and artworks with the period toggle", async () => {
    renderWithRelay({
      Artist: () => ({ internalID: "banksy", name: "Banksy", href: "/artist/banksy" }),
    })

    await screen.findByText("Banksy")

    expect(screen.getByText("Trending Artists")).toBeOnTheScreen()
    expect(screen.getByText("Trending Artworks")).toBeOnTheScreen()

    expect(screen.getByRole("button", { selected: true, name: "Today" })).toBeOnTheScreen()
    expect(screen.getByRole("button", { selected: false, name: "Past 7 Days" })).toBeOnTheScreen()
  })
})
