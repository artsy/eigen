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
  it("renders trending artists and artworks without period tabs", async () => {
    renderWithRelay({
      Artist: () => ({ internalID: "banksy", name: "Banksy", href: "/artist/banksy" }),
    })

    await screen.findByText("Banksy")

    expect(screen.getByText("Trending Artists")).toBeOnTheScreen()
    expect(screen.getByText("Trending Artworks")).toBeOnTheScreen()

    expect(screen.queryByText("Today")).not.toBeOnTheScreen()
    expect(screen.queryByText("Past 7 Days")).not.toBeOnTheScreen()
    expect(screen.queryByText("Past 30 Days")).not.toBeOnTheScreen()
  })

  it("only requests the ONE_DAY trending period", async () => {
    const requestedPeriods: unknown[] = []

    const { env } = renderWithRelay({
      TrendingSearches: (context) => {
        requestedPeriods.push(context.args?.period)
        return {}
      },
      Artist: () => ({ internalID: "banksy", name: "Banksy", href: "/artist/banksy" }),
    })

    await screen.findByText("Banksy")

    expect(requestedPeriods).toEqual(["ONE_DAY"])
    expect(env.mock.getAllOperations()).toHaveLength(0)
  })
})
