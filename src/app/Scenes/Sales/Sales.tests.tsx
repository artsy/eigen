import { act, screen, waitFor } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { CurrentlyRunningAuctions } from "./CurrentlyRunningAuctions"
import { SalesScreen } from "./Sales"
import { UpcomingAuctions } from "./UpcomingAuctions"

describe("Sales", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SalesScreen />,
  })

  const upcomingAuctionsRefreshMock = jest.fn()
  const currentAuctionsRefreshMock = jest.fn()

  it("renders without Errors", async () => {
    renderWithRelay()

    await waitFor(() => expect(screen.queryByTestId("SalePlaceholder")).toBeNull())

    expect(screen.getByTestId("Sales-Screen-ScrollView")).toBeDefined()
  })

  it("renders the ZeroState when there are no sales", async () => {
    renderWithRelay()

    await waitFor(() => expect(screen.queryByTestId("SalePlaceholder")).toBeNull())

    const CurrentAuction = screen.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = screen.UNSAFE_getAllByType(UpcomingAuctions)[0]

    act(() => {
      CurrentAuction.props.setSalesCountOnParent(0)
      UpcomingAuction.props.setSalesCountOnParent(0)
    })

    await screen.findByTestId("Sales-Zero-State-Container")
  })

  it("Can refresh current and upcoming auctions", async () => {
    renderWithRelay()

    await waitFor(() => expect(screen.queryByTestId("SalePlaceholder")).toBeNull())

    const CurrentAuction = screen.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = screen.UNSAFE_getAllByType(UpcomingAuctions)[0]

    const ScrollView = screen.getByTestId("Sales-Screen-ScrollView")

    await act(() => {
      CurrentAuction.props.setRefetchPropOnParent(currentAuctionsRefreshMock)
      UpcomingAuction.props.setRefetchPropOnParent(upcomingAuctionsRefreshMock)
      // pull to refresh
      ScrollView.props.refreshControl.props.onRefresh()
    })

    expect(upcomingAuctionsRefreshMock).toHaveBeenCalledTimes(1)
    expect(currentAuctionsRefreshMock).toHaveBeenCalledTimes(1)
  })

  it("renders RecommendedAuctionLotsRail", async () => {
    renderWithRelay({
      Query: () => viewer,
    })
    await waitFor(() => expect(screen.queryByTestId("SalePlaceholder")).toBeNull())

    expect(screen.getByText("Auction Lots for You")).toBeDefined()
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
