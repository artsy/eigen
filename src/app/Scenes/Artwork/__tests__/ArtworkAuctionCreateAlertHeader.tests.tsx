import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkAuctionCreateAlertHeader } from "app/Scenes/Artwork/ArtworkAuctionCreateAlertHeader"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkAuctionCreateAlertHeader", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ artwork }: any) => <ArtworkAuctionCreateAlertHeader artwork={artwork} />,
    query: graphql`
      query ArtworkAuctionCreateAlertHeader_Test_Query @relay_test_operation {
        artwork(id: "artwork-id") {
          ...ArtworkAuctionCreateAlertHeader_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    mockTrackEvent.mockClear()
  })

  // Relay default for Boolean is false, for String is a non-empty mock string (truthy).
  // So by default: isEligibleToCreateAlert=false, isInAuction=false, but endedAt is truthy.
  // To make the component visible we need isEligibleToCreateAlert+isInAuction=true,
  // and the lot to appear closed (endedAt truthy by default satisfies isLotClosed).
  const visibleArtwork = {
    isEligibleToCreateAlert: true,
    isInAuction: true,
    artistNames: "Banksy",
    title: "Flower Thrower",
    internalID: "artwork-internal-id",
    slug: "banksy-flower-thrower",
  }

  describe("visibility conditions", () => {
    it("does not render when artwork is not eligible to create an alert", () => {
      renderWithRelay({ Artwork: () => ({ ...visibleArtwork, isEligibleToCreateAlert: false }) })

      expect(screen.queryByText(/has closed/)).not.toBeOnTheScreen()
    })

    it("does not render when artwork is not in auction", () => {
      renderWithRelay({ Artwork: () => ({ ...visibleArtwork, isInAuction: false }) })

      expect(screen.queryByText(/has closed/)).not.toBeOnTheScreen()
    })

    it("does not render when the lot is still active", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: false }),
        // endedAt: null means isLotClosed returns false; null endAt/extendedBiddingEndAt
        // means hasBiddingEnded returns false (getTimer returns hasEnded:false for invalid dates)
        SaleArtwork: () => ({ endedAt: null, endAt: null, extendedBiddingEndAt: null }),
      })

      expect(screen.queryByText(/has closed/)).not.toBeOnTheScreen()
    })

    it("renders when lot is closed", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
      })

      expect(screen.getByText(/has closed/)).toBeOnTheScreen()
    })
  })

  describe("closed auction message", () => {
    it("displays artist name and title in the heading", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
      })

      expect(screen.getByText(/Banksy/)).toBeOnTheScreen()
      expect(screen.getByText(/Flower Thrower/)).toBeOnTheScreen()
      expect(screen.getByText(/has closed/)).toBeOnTheScreen()
    })

    it("omits artist prefix in heading when artistNames is null", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork, artistNames: null }),
        Sale: () => ({ isClosed: true }),
      })

      expect(screen.getByText(/has closed/)).toBeOnTheScreen()
    })
  })

  describe("action buttons", () => {
    it("shows 'Manage your Alerts' button when user has lost the bid", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
        // isHighestBidder defaults to false (Relay Boolean default), so user is a bidder
        // but not the highest → hasLostBid = true
      })

      expect(screen.getByText("Manage your Alerts")).toBeOnTheScreen()
      expect(screen.queryByText("Create Alert")).not.toBeOnTheScreen()
    })

    it("shows the lost-bid subtitle when user lost the bid", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
      })

      expect(screen.getByText(/We've created an alert for you for similar works/)).toBeOnTheScreen()
    })

    it("shows 'Create Alert' button when user is the highest bidder", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
        LotStanding: () => ({ isHighestBidder: true }),
      })

      expect(screen.getByText("Create Alert")).toBeOnTheScreen()
      expect(screen.queryByText("Manage your Alerts")).not.toBeOnTheScreen()
    })

    it("shows the generic subtitle when user has not lost the bid", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
        LotStanding: () => ({ isHighestBidder: true }),
      })

      expect(screen.getByText(/Get notified when similar works become available/)).toBeOnTheScreen()
    })
  })

  describe("'Browse Similar Artworks' button", () => {
    it("is shown when there are suggested artworks", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
        ArtworkConnection: () => ({ totalCount: 5 }),
      })

      expect(screen.getByText("Browse Similar Artworks")).toBeOnTheScreen()
    })

    it("is not shown when there are no suggested artworks", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
        ArtworkConnection: () => ({ totalCount: 0 }),
      })

      expect(screen.queryByText("Browse Similar Artworks")).not.toBeOnTheScreen()
    })
  })

  describe("tracking", () => {
    it("tracks create alert tap when 'Create Alert' is pressed", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
        LotStanding: () => ({ isHighestBidder: true }),
        ArtworkConnection: () => ({ totalCount: 0 }),
      })

      fireEvent.press(screen.getByText("Create Alert"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedCreateAlert",
            "context_module": "artworkClosedLotHeader",
            "context_screen_owner_id": "artwork-internal-id",
            "context_screen_owner_slug": "banksy-flower-thrower",
            "context_screen_owner_type": "artwork",
          },
        ]
      `)
    })

    it("tracks browse similar artworks tap when the button is pressed", () => {
      renderWithRelay({
        Artwork: () => ({ ...visibleArtwork }),
        Sale: () => ({ isClosed: true }),
        LotStanding: () => ({ isHighestBidder: true }),
        ArtworkConnection: () => ({ totalCount: 5 }),
      })

      fireEvent.press(screen.getByText("Browse Similar Artworks"))

      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedBrowseSimilarArtworks",
            "context_module": "artworkClosedLotHeader",
            "context_screen_owner_id": "artwork-internal-id",
            "context_screen_owner_slug": "banksy-flower-thrower",
            "context_screen_owner_type": "artwork",
          },
        ]
      `)
    })
  })
})
