import { fireEvent, screen } from "@testing-library/react-native"
import { useTrendingSearchesQuery } from "__generated__/useTrendingSearchesQuery.graphql"
import { TrendingSearches } from "app/Scenes/Search/TrendingSearches/TrendingSearches"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
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

  it("tracks a tap on a trending artwork", async () => {
    renderWithRelay({
      Artist: () => ({ internalID: "banksy", name: "Banksy", href: "/artist/banksy" }),
      Artwork: () => ({ internalID: "artwork-id", slug: "artwork-slug" }),
    })

    await screen.findByText("Banksy")

    fireEvent.press(screen.getAllByTestId("artwork-artwork-slug")[0])

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tappedArtworkGroup",
        context_module: "trendingArtworksRail",
        context_screen_owner_type: "search",
        destination_screen_owner_type: "artwork",
        destination_screen_owner_id: "artwork-id",
        destination_screen_owner_slug: "artwork-slug",
        horizontal_slide_position: 0,
        type: "thumbnail",
      })
    )
  })
})
