import { fireEvent } from "@testing-library/react-native"
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

jest.mock("app/store/GlobalStore", () => ({
  GlobalStoreProvider: jest.requireActual("app/store/GlobalStore").GlobalStoreProvider,
  useFeatureFlag: jest.requireActual("app/store/GlobalStore").useFeatureFlag,
  GlobalStore: jest.requireActual("app/store/GlobalStore").GlobalStore,
}))

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

    const { queryByText, getByText } = getWrapper({ artwork })

    expect(queryByText(/Want to sell a work by Santa?/)).toBeTruthy()
    expect(queryByText(/Consign with Artsy/)).toBeTruthy()
    fireEvent.press(getByText(/Consign with Artsy/))
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

    const { getByText } = getWrapper({ artwork })

    fireEvent.press(getByText(/Consign with Artsy/))
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
      const { queryByText } = getWrapper({ artwork })
      expect(queryByText(/Want to sell a work by these artists?/)).toBeTruthy()
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

      const { queryByText } = getWrapper({ artwork })
      expect(queryByText(/Consign with Artsy/)).toBeTruthy()
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
      const { queryByText } = getWrapper({ artwork })

      expect(queryByText(/Consign with Artsy/)).toBeNull()
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
      const { queryByText } = getWrapper({ artwork })
      expect(queryByText(/Want to sell a work by Santa?/)).toBeTruthy()
      expect(queryByText(/Consign with Artsy/)).toBeTruthy()
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
      const { queryByText } = getWrapper({ artwork, auctionState: AuctionTimerState.CLOSING })

      expect(queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(queryByText(/Conditions of Sale/)).toBeTruthy()
      expect(queryByText("Read our auction FAQs")).toBeTruthy()
      expect(queryByText("ask a specialist")).toBeTruthy()
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

      const { queryByText } = getWrapper({ artwork: notForSaleArtwork })

      expect(queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeNull()
      expect(queryByText(/Conditions of Sale/)).toBeNull()
      expect(queryByText("Read our auction FAQs")).toBeNull()
      expect(queryByText("ask a specialist")).toBeNull()
    })

    it("hides auction links when auctionState is closed", () => {
      const { queryByText } = getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSED,
      })

      expect(queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeNull()
      expect(queryByText(/Conditions of Sale/)).toBeNull()
      expect(queryByText("Read our auction FAQs")).toBeNull()
      expect(queryByText("ask a specialist")).toBeNull()
    })

    it("displays auction links when auctionState is closing", () => {
      const { queryByText } = getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSING,
      })

      expect(queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(queryByText(/Conditions of Sale/)).toBeTruthy()
      expect(queryByText("Read our auction FAQs")).toBeTruthy()
      expect(queryByText("ask a specialist")).toBeTruthy()
    })

    it("displays auction links when auctionState is live_integration_upcoming", () => {
      const { queryByText } = getWrapper({
        artwork,
        auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      })

      expect(queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(queryByText(/Conditions of Sale/)).toBeTruthy()
      expect(queryByText("Read our auction FAQs")).toBeTruthy()
      expect(queryByText("ask a specialist")).toBeTruthy()
    })

    it("displays auction links when auctionState is inProgress", () => {
      const { queryByText } = getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSING,
      })

      expect(queryByText(/By placing a bid you agree to Artsy's and Christie's/)).toBeTruthy()
      expect(queryByText(/Conditions of Sale/)).toBeTruthy()
      expect(queryByText("Read our auction FAQs")).toBeTruthy()
      expect(queryByText("ask a specialist")).toBeTruthy()
    })

    describe("Analytics", () => {
      it("posts proper event in when clicking Ask A Specialist", () => {
        const { getByText, queryByText } = getWrapper({ artwork })

        expect(queryByText("ask a specialist")).toBeTruthy()
        fireEvent.press(getByText("ask a specialist"))

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
        const { getByText, queryByText } = getWrapper({ artwork })

        expect(queryByText("Read our auction FAQs")).toBeTruthy()
        fireEvent.press(getByText("Read our auction FAQs"))

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
        const { getByText, queryByText } = getWrapper({ artwork })

        expect(queryByText("Conditions of Sale")).toBeTruthy()
        fireEvent.press(getByText("Conditions of Sale"))

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
