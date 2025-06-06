import { StackActions } from "@react-navigation/native"
import { fireEvent, screen } from "@testing-library/react-native"
import { BidResult_saleArtwork$data } from "__generated__/BidResult_saleArtwork.graphql"
import { BidFlowContextProvider } from "app/Components/Bidding/Context/BidFlowContextProvider"
import { BidResult } from "app/Components/Bidding/Screens/BidResult"
import { BidderPositionResult } from "app/Components/Bidding/types"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("BidResult component", () => {
  const dispatch = jest.fn()
  const mockNavigator = { dispatch }
  const refreshBidderInfoMock = jest.fn()
  const refreshSaleArtworkInfoMock = jest.fn()

  Date.now = jest.fn(() => 1525983752116)
  jest.useFakeTimers({ legacyFakeTimers: true })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => (
      <BidFlowContextProvider>
        <BidResult
          navigation={mockNavigator as any}
          route={
            {
              params: {
                refreshBidderInfo: refreshBidderInfoMock,
                refreshSaleArtwork: refreshSaleArtworkInfoMock,
                ...props,
              },
            } as any
          }
        />
      </BidFlowContextProvider>
    ),
    query: graphql`
      query BidResultTestsQuery @relay_test_operation {
        saleArtwork(id: "saleArtworkId") {
          ...BidResult_saleArtwork
        }
      }
    `,
  })

  describe("high bidder", () => {
    it("renders a timer", () => {
      renderWithRelay({ Sale: () => sale }, { bidderPositionResult: Statuses.winning })

      expect(screen.getByLabelText("Countdown")).toBeOnTheScreen()
    })

    it("dismisses the controller when the continue button is pressed", () => {
      renderWithRelay({ Sale: () => sale }, { bidderPositionResult: Statuses.winning })

      fireEvent.press(screen.getByText("Continue"))

      jest.runAllTicks()

      expect(dismissModal).toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe("low bidder", () => {
    it("renders a timer", () => {
      renderWithRelay({ Sale: () => sale }, { bidderPositionResult: Statuses.outbid })

      expect(screen.getByLabelText("Countdown")).toBeOnTheScreen()
    })

    it("pops to root when bid-again button is pressed", () => {
      renderWithRelay({ Sale: () => sale }, { bidderPositionResult: Statuses.outbid })

      fireEvent.press(screen.getByText("Bid again"))

      expect(refreshBidderInfoMock).toHaveBeenCalled()
      expect(refreshSaleArtworkInfoMock).toHaveBeenCalled()
      expect(dispatch).toHaveBeenCalledWith(StackActions.popToTop())
    })
  })

  describe("live bidding has started", () => {
    it("doesn't render a timer", () => {
      renderWithRelay({ Sale: () => sale }, { bidderPositionResult: Statuses.liveBiddingStarted })

      expect(screen.queryByLabelText("Countdown")).not.toBeOnTheScreen()
    })

    it("dismisses controller and presents live interface when continue button is pressed", () => {
      renderWithRelay({ Sale: () => sale }, { bidderPositionResult: Statuses.liveBiddingStarted })

      fireEvent.press(screen.getByText("Continue"))
      jest.runAllTicks()

      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/sale-id", {
        modal: true,
      })
    })
  })
})

const positionPlaceholder: BidderPositionResult["position"] = {
  id: "",
  suggestedNextBid: {
    cents: "",
    display: "",
  },
}

const winningStatus: BidderPositionResult = {
  status: "WINNING",
  messageHeader: "",
  messageDescriptionMD: "",
  position: positionPlaceholder,
}

const outbidStatus: BidderPositionResult = {
  status: "OUTBID",
  messageHeader: "Your bid wasn’t high enough",
  messageDescriptionMD: `
    Another bidder placed a higher max bid or the same max bid before you did.
  `,
  position: positionPlaceholder,
}

const liveBiddingStartedStatus: BidderPositionResult = {
  status: "LIVE_BIDDING_STARTED",
  messageHeader: "Live bidding has started",
  messageDescriptionMD: `
    Sorry, your bid wasn’t received before live bidding started.
    To continue bidding, please [join the live auction](http://live-staging.artsy.net/).
  `,
  position: positionPlaceholder,
}

const Statuses = {
  winning: winningStatus,
  outbid: outbidStatus,
  liveBiddingStarted: liveBiddingStartedStatus,
}

const sale: BidResult_saleArtwork$data["sale"] = {
  cascadingEndTimeIntervalMinutes: null,
  liveStartAt: "2022-01-01T00:03:00+00:00",
  endAt: "2022-05-01T00:03:00+00:00",
  slug: "sale-id",
}
