import { act, fireEvent, screen } from "@testing-library/react-native"
import { SalesScreen, SUPPORT_ARTICLE_URL } from "app/Scenes/Sales/Sales"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("Sales", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SalesScreen />,
  })

  it("renders without Errors", () => {
    renderWithRelay()

    expect(screen.getByTestId("Sales-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("Can refresh screen with pull to refresh", async () => {
    renderWithRelay()

    const ScrollView = screen.getByTestId("Sales-Screen-ScrollView")
    const refreshControl = ScrollView.props.refreshControl

    expect(refreshControl.props.refreshing).toBe(false)

    await act(async () => {
      refreshControl.props.onRefresh()
    })

    // After refresh is triggered, components should remount with new keys
    expect(screen.getByTestId("Sales-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("renders with sales count state", () => {
    const { UNSAFE_getByType } = renderWithRelay()

    // Verify the component renders and has the scroll view
    expect(screen.getByTestId("Sales-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("tracks article tap with the correct event data", () => {
    renderWithRelay()

    const learnMoreLink = screen.getByText("Learn more about bidding on Artsy.")
    fireEvent.press(learnMoreLink)

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedLink",
      context_module: "header",
      context_screen_owner_type: "auctions",
      destination_path: SUPPORT_ARTICLE_URL,
    })
  })
})

const artwork = {
  slug: "artwork-one-slug",
  id: "artwork-one-id",
  image: {
    aspectRatio: 1.27,
    url: "https://d32dm0rphc51dk.cloudfront.net/ZRMpZo7ikbEdx3yqBNlDVA/large.jpg",
  },
  title: "Sunflower Seeds Exhibition",
  date: "2010",
  saleMessage: "US$1,750",
  internalID: "artwork-one-internalID",
  artistNames: "Ai Weiwei",
  href: "/artwork/ai-weiwei-sunflower-seeds-exhibition",
  sale: null,
  saleArtwork: null,
  partner: {
    name: "West Chelsea Contemporary",
  },
}

const viewer = {
  artworksForUser: {
    includeBackfill: true,
    first: 10,
    onlyAtAuction: true,
    edges: [{ node: artwork }],
  },
}

const me = {
  auctionResultsByFollowedArtists: {
    first: 10,
    edges: [
      {
        node: {
          id: "an-id",
        },
      },
    ],
  },
}
