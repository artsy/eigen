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
