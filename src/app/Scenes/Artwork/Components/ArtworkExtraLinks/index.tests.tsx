import { fireEvent } from "@testing-library/react-native"
import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { navigate } from "app/navigation/navigate"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { useExperimentFlag } from "app/utils/experiments/hooks"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Sans, Theme } from "palette"
import React from "react"
import { Text } from "react-native"
import { ArtworkExtraLinks } from "./index"

jest.mock("app/utils/experiments/hooks", () => ({
  ...jest.requireActual("app/utils/experiments/hooks"),
  useExperimentFlag: jest.fn(),
}))

function getWrapper({
  artwork,
  auctionState,
}: {
  artwork: ArtworkExtraLinks_artwork
  auctionState?: AuctionTimerState
}) {
  return mount(
    <GlobalStoreProvider>
      <Theme>
        <ArtworkExtraLinks artwork={artwork} auctionState={auctionState!} />
      </Theme>
    </GlobalStoreProvider>
  )
}

describe("ArtworkExtraLinks", () => {
  const mockUseExperimentFlag = useExperimentFlag as jest.Mock

  beforeEach(() => {
    // TODO: Remove it when "eigen-artwork-page-create-alert" flag is released
    mockUseExperimentFlag.mockImplementation(() => false)
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

    const component = getWrapper({ artwork })
    const consignmentsLink = component.find(Text).at(1)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const texts = component.find(Sans).map((x) => x.text())

    expect(texts[0]).toContain("Consign with Artsy.")
    consignmentsLink.props().onPress()
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

    __globalStoreTestUtils__?.injectState({ bottomTabs: { sessionState: { selectedTab: "sell" } } })
    const component = getWrapper({ artwork })
    const consignmentsLink = component.find(Text).at(1)

    consignmentsLink.props().onPress()
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
      const component = getWrapper({ artwork })
      expect(component.text()).toContain("Want to sell a work by these artists?")
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

      const component = getWrapper({ artwork })
      expect(component.text()).toContain("Consign with Artsy.")
    })

    it("doesn't render component if no artists are consignable", () => {
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
      const component = getWrapper({ artwork })
      expect(component).toEqual({})
    })
  })

  describe("for an artwork with one artist", () => {
    it("shows singular link text", () => {
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
      const component = getWrapper({ artwork })
      expect(component.text()).toContain("Want to sell a work by Santa?")
    })

    it("shows consign link", () => {
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
      const component = getWrapper({ artwork })
      expect(component.text()).toContain("Consign with Artsy.")
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

      const component = getWrapper({ artwork })
      expect(component.text()).not.toContain("Read our FAQ")
      expect(component.text()).not.toContain("ask a specialist")
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

      const component = getWrapper({ artwork })
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).toContain("ask a specialist")
    })

    it("renders ask a specialist link when isOfferable", () => {
      const artwork = {
        ...ArtworkFixture,
        isOfferable: true,
        isForSale: true,
        isInquireable: true,
        artists: [{ name: "Santa", isConsignable: true }],
      }

      const component = getWrapper({ artwork })
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).toContain("ask a specialist")
    })
  })

  describe("FAQ and specialist Auction links", () => {
    const artwork: ArtworkExtraLinks_artwork = {
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

    const component = getWrapper({ artwork, auctionState: AuctionTimerState.CLOSING })

    it("renders Auction specific text", () => {
      expect(component.find(Sans).at(0).text()).toContain(
        "By placing a bid you agree to Artsy's and Christie's Conditions of Sale."
      )
      expect(component.find(Sans).at(1).text()).toContain("Read our auction FAQs")
      expect(component.find(Sans).at(1).text()).toContain("ask a specialist")
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

      const componentWithNoLink = getWrapper({ artwork: notForSaleArtwork })
      expect(componentWithNoLink.find(Sans).length).toEqual(0)
    })

    it("hides auction links when auctionState is closed", () => {
      const componentWithEndedAuctionState = getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSED,
      })
      expect(componentWithEndedAuctionState.text()).not.toContain("By placing a bid you agree to")
    })

    it("displays auction links when auctionState is closing", () => {
      const componentWithEndedAuctionState = getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSING,
      })
      expect(componentWithEndedAuctionState.text()).toContain("By placing a bid you agree to")
    })

    it("displays auction links when auctionState is live_integration_upcoming", () => {
      const componentWithEndedAuctionState = getWrapper({
        artwork,
        auctionState: AuctionTimerState.LIVE_INTEGRATION_UPCOMING,
      })
      expect(componentWithEndedAuctionState.text()).toContain("By placing a bid you agree to")
    })

    it("displays auction links when auctionState is inProgress", () => {
      const componentWithEndedAuctionState = getWrapper({
        artwork,
        auctionState: AuctionTimerState.CLOSING,
      })
      expect(componentWithEndedAuctionState.text()).toContain("By placing a bid you agree to")
    })

    describe("Analytics", () => {
      const TestRenderer = () =>
        renderWithWrappersTL(
          <ArtworkExtraLinks artwork={artwork} auctionState={AuctionTimerState.CLOSING} />
        )

      it("posts proper event in when clicking Ask A Specialist", () => {
        const { getByText, queryByText } = TestRenderer()

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
        const { getByText, queryByText } = TestRenderer()

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
        const { getByText, queryByText } = TestRenderer()

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

    describe("`eigen-artwork-page-create-alert` flag is enabled", () => {
      beforeEach(() => {
        mockUseExperimentFlag.mockImplementation(() => true)
      })

      const TestRenderer = () =>
        renderWithWrappersTL(
          <ArtworkExtraLinks artwork={artwork} auctionState={AuctionTimerState.CLOSING} />
        )

      it("should not show the FaqAndSpecialistSection component", () => {
        const { queryByText } = TestRenderer()

        // Makes sure that no parts of the text references of the FaqAndSpecialistSection
        // appear in the rendered component when ff - eigen-artwork-page-create-alert is enabled
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
