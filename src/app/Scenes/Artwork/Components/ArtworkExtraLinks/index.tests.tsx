import { fireEvent } from "@testing-library/react-native"
import { ArtworkExtraLinks_artwork$data } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ModalStack } from "app/navigation/ModalStack"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__, useSelectedTab } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { ArtworkExtraLinks } from "./index"

jest.mock("app/store/GlobalStore", () => ({
  __globalStoreTestUtils__: jest.requireActual("app/store/GlobalStore").__globalStoreTestUtils__,
  GlobalStoreProvider: jest.requireActual("app/store/GlobalStore").GlobalStoreProvider,
  useSelectedTab: jest.fn(() => "home"),
  useFeatureFlag: jest.requireActual("app/store/GlobalStore").useFeatureFlag,
  GlobalStore: jest.requireActual("app/store/GlobalStore").GlobalStore,
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
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: false })
  })

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

  describe("FAQ and specialist BNMO links", () => {
    it("does not render FAQ or ask a specialist links when isInquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: false,
        isInquireable: true,
        isForSale: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const { queryByText } = getWrapper({ artwork })
      expect(queryByText("Read our FAQ")).toBeNull()
      expect(queryByText("ask a specialist")).toBeNull()
    })

    it("renders ask a specialist link when isAcquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isForSale: true,
        isInquireable: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const { queryByText } = getWrapper({ artwork })
      expect(queryByText("Read our FAQ")).toBeTruthy()
      expect(queryByText("ask a specialist")).toBeTruthy()
    })

    it("renders ask a specialist link when isOfferable", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isForSale: true,
        isInquireable: true,
        artists: [{ name: "Santa", isConsignable: true }],
      }

      const { queryByText } = getWrapper({ artwork })
      expect(queryByText("Read our FAQ")).toBeTruthy()
      expect(queryByText("ask a specialist")).toBeTruthy()
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
          Array [
            Object {
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
          Array [
            Object {
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
          Array [
            Object {
              "action_name": "conditionsOfSale",
              "action_type": "tap",
              "context_module": "ArtworkExtraLinks",
            },
          ]
        `)
      })
    })

    describe("AREnableCreateArtworkAlert is switched to true", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCreateArtworkAlert: true })
      })

      const TestRenderer = () =>
        renderWithWrappers(
          <ModalStack>
            <ArtworkExtraLinks artwork={artwork as any} auctionState={AuctionTimerState.CLOSING} />
          </ModalStack>
        )

      it("should not show the FaqAndSpecialistSection component", () => {
        const { queryByText } = TestRenderer()

        // Makes sure that no parts of the text references of the FaqAndSpecialistSection
        // appear in the rendered component when ff - AREnableCreateArtworkAlert is true
        expect(
          queryByText("By placing a bid you agree to Artsy's and Christie's", { exact: false })
        ).toBeTruthy()
        expect(queryByText("Conditions of Sale")).toBeTruthy()
        expect(queryByText("Have a question?", { exact: false })).toBeTruthy()
        expect(queryByText("Read our auction FAQs")).toBeTruthy()
        expect(queryByText("ask a specialist")).toBeTruthy()
        expect(queryByText("Read our FAQ")).toBeNull()
      })
    })
  })
})
