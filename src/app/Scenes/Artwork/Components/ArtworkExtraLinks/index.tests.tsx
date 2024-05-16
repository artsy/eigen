import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkExtraLinks_artwork$data } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { ModalStack } from "app/system/navigation/ModalStack"
import { navigate } from "app/system/navigation/navigate"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtworkExtraLinks } from "./index"

jest.mock("app/utils/hooks/useSelectedTab", () => ({
  useSelectedTab: jest.fn(() => "home"),
}))

const getWrapper = ({
  artwork,
  auctionState,
}: {
  artwork: CleanRelayFragment<ArtworkExtraLinks_artwork$data>
  auctionState?: AuctionTimerState
}) =>
  renderWithWrappers(
    <ModalStack>
      <ArtworkExtraLinks artwork={artwork as any} auctionState={auctionState!} />
    </ModalStack>
  )

describe("ArtworkExtraLinks", () => {
  it("redirects to /sales when consignments link is clicked from outside of sell tab", () => {
    const artwork = {
      ...ArtworkFixture,
      isForSale: true,
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }

    getWrapper({ artwork })

    expect(screen.getByText(/Want to sell a work by Santa?/)).toBeTruthy()
    expect(screen.getByText(/Consign with Artsy/)).toBeTruthy()
    fireEvent.press(screen.getByText(/Consign with Artsy/))
    expect(navigate).toHaveBeenCalledWith("/sales")
  })

  it("redirects to /collections/my-collection/marketing-landing when consignments link is clicked from within sell tab", () => {
    const artwork = {
      ...ArtworkFixture,
      isForSale: true,
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }

    ;(useSelectedTab as any).mockImplementation(() => "sell")

    getWrapper({ artwork })

    fireEvent.press(screen.getByText(/Consign with Artsy/))
    expect(navigate).toHaveBeenCalledWith("/collections/my-collection/marketing-landing")
  })

  describe("for an artwork with more than 1 consignable artist", () => {
    it("shows plural link text", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
          {
            name: "Easter Bunny",
            isConsignable: true,
          },
        ],
      }
      getWrapper({ artwork })
      expect(screen.getByText(/Want to sell a work by these artists?/)).toBeTruthy()
    })

    it("shows consign link if at least 1 artist is consignable", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      getWrapper({ artwork })
      expect(screen.getByText(/Consign with Artsy/)).toBeTruthy()
    })

    it("doesn't render component if no artists are consignable", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: false,
          },
        ],
      }
      getWrapper({ artwork })

      expect(screen.queryByText(/Consign with Artsy/)).toBeNull()
    })
  })

  describe("for an artwork with one artist", () => {
    it("shows correct link text and consign text", () => {
      const artwork = {
        ...ArtworkFixture,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }
      getWrapper({ artwork })
      expect(screen.getByText(/Want to sell a work by Santa?/)).toBeTruthy()
      expect(screen.getByText(/Consign with Artsy/)).toBeTruthy()
    })
  })

  describe("FAQ and specialist Auction links", () => {
    const artwork = {
      ...ArtworkFixture,
      isForSale: true,
      isInAuction: true,
      sale: {
        isClosed: false,
        isBenefit: false,
        partner: {
          name: "Christie's",
        },
      },
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }

    it("renders Auction specific text", () => {
      getWrapper({ artwork, auctionState: AuctionTimerState.CLOSING })

      expect(screen.getByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(screen.getByText(/Conditions of Sale/)).toBeTruthy()
      expect(screen.getByText("Read our auction FAQs")).toBeTruthy()
      expect(screen.getByText("ask a specialist")).toBeTruthy()
    })

    it("hides auction links when auction work has sold via buy now", () => {
      const notForSaleArtwork = {
        ...ArtworkFixture,
        isInAuction: true,
        isForSale: false,
        sale: {
          isClosed: false,
          internalID: "123",
          isBenefit: false,
          partner: {
            name: "Christie's",
          },
        },
        artists: [
          {
            name: "Santa",
            isConsignable: false,
          },
        ],
      }

      getWrapper({ artwork: notForSaleArtwork })

      expect(screen.queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeNull()
      expect(screen.queryByText(/Conditions of Sale/)).toBeNull()
      expect(screen.queryByText("Read our auction FAQs")).toBeNull()
      expect(screen.queryByText("ask a specialist")).toBeNull()
    })

    it("hides auction links when auctionState is closed", () => {
      getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSED,
      })

      expect(screen.queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeNull()
      expect(screen.queryByText(/Conditions of Sale/)).toBeNull()
      expect(screen.queryByText("Read our auction FAQs")).toBeNull()
      expect(screen.queryByText("ask a specialist")).toBeNull()
    })

    it("displays auction links when auctionState is closing", () => {
      getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSING,
      })

      expect(screen.getByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(screen.getByText(/Conditions of Sale/)).toBeTruthy()
      expect(screen.getByText("Read our auction FAQs")).toBeTruthy()
      expect(screen.getByText("ask a specialist")).toBeTruthy()
    })

    it("displays auction links when auctionState is live_integration_upcoming", () => {
      getWrapper({
        artwork,
        auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      })

      expect(screen.getByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(screen.getByText(/Conditions of Sale/)).toBeTruthy()
      expect(screen.getByText("Read our auction FAQs")).toBeTruthy()
      expect(screen.getByText("ask a specialist")).toBeTruthy()
    })

    it("displays auction links when auctionState is inProgress", () => {
      getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSING,
      })

      expect(screen.getByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(screen.getByText(/Conditions of Sale/)).toBeTruthy()
      expect(screen.getByText("Read our auction FAQs")).toBeTruthy()
      expect(screen.getByText("ask a specialist")).toBeTruthy()
    })

    describe("Analytics", () => {
      it("posts proper event in when clicking Ask A Specialist", () => {
        getWrapper({ artwork })

        expect(screen.getByText("ask a specialist")).toBeTruthy()
        fireEvent.press(screen.getByText("ask a specialist"))

        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action_name": "askASpecialist",
              "action_type": "tap",
              "context_module": "ArtworkExtraLinks",
            },
          ]
        `)
      })

      it("posts proper event in when clicking Read our auction FAQs", () => {
        getWrapper({ artwork })

        expect(screen.getByText("Read our auction FAQs")).toBeTruthy()
        fireEvent.press(screen.getByText("Read our auction FAQs"))

        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action_name": "auctionsFAQ",
              "action_type": "tap",
              "context_module": "ArtworkExtraLinks",
            },
          ]
        `)
      })

      it("posts proper event in when clicking Conditions of Sale", () => {
        getWrapper({ artwork })

        expect(screen.getByText("Conditions of Sale")).toBeTruthy()
        fireEvent.press(screen.getByText("Conditions of Sale"))

        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
          [
            {
              "action_name": "conditionsOfSale",
              "action_type": "tap",
              "context_module": "ArtworkExtraLinks",
            },
          ]
        `)
      })
    })
  })
})
