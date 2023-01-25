import { fireEvent } from "@testing-library/react-native"
import { BidResultTestsQuery } from "__generated__/BidResultTestsQuery.graphql"
import { BidResult_sale_artwork$data } from "__generated__/BidResult_sale_artwork.graphql"
import { BidderPositionResult } from "app/Components/Bidding/types"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { QueryRenderer } from "react-relay"
import { graphql } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"
import { BidResultScreen } from "./BidResult"


const sale: BidResult_sale_artwork$data["sale"] = {
  cascadingEndTimeIntervalMinutes: null,
  liveStartAt: "2022-01-01T00:03:00+00:00",
  endAt: "2022-05-01T00:03:00+00:00",
  slug: "sale-id",
}

interface WrapperProps {
  bidderPositionResult: BidderPositionResult
}

describe("BidResult component", () => {
  const popToTop = jest.fn()
  const mockNavigator = { popToTop }
  const refreshBidderInfoMock = jest.fn()
  const refreshSaleArtworkInfoMock = jest.fn()
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  Date.now = jest.fn(() => 1525983752116)
  jest.useFakeTimers({
    legacyFakeTimers: true,
  })

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const TestWrapper = (props: WrapperProps) => {
    return (
      <QueryRenderer<BidResultTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query BidResultTestsQuery @relay_test_operation @raw_response_type {
            saleArtwork(id: "saleArtworkId") {
              ...BidResult_sale_artwork
            }
          }
        `}
        variables={{}}
        render={({ props: relayProps }) => {
          if (relayProps?.saleArtwork) {
            return (
              <BidResultScreen
                refreshBidderInfo={refreshBidderInfoMock}
                refreshSaleArtwork={refreshSaleArtworkInfoMock}
                sale_artwork={relayProps.saleArtwork}
                navigator={mockNavigator as any}
                {...props}
              />
            )
          }

          return null
        }}
      />
    )
  }

  describe("high bidder", () => {
    it("renders a timer", () => {
      const { getByLabelText } = renderWithWrappers(
        <TestWrapper bidderPositionResult={Statuses.winning} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => sale,
      })

      expect(getByLabelText("Countdown")).toBeTruthy()
    })

    it("dismisses the controller when the continue button is pressed", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper bidderPositionResult={Statuses.winning} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => sale,
      })

      fireEvent.press(getByText("Continue"))
      jest.runAllTicks()

      expect(dismissModal).toHaveBeenCalled()
      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe("low bidder", () => {
    it("renders a timer", () => {
      const { getByLabelText } = renderWithWrappers(
        <TestWrapper bidderPositionResult={Statuses.outbid} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => sale,
      })

      expect(getByLabelText("Countdown")).toBeTruthy()
    })

    it("pops to root when bid-again button is pressed", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper bidderPositionResult={Statuses.outbid} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => sale,
      })

      fireEvent.press(getByText("Bid again"))

      expect(refreshBidderInfoMock).toHaveBeenCalled()
      expect(refreshSaleArtworkInfoMock).toHaveBeenCalled()
      expect(popToTop).toHaveBeenCalled()
    })
  })

  describe("live bidding has started", () => {
    it("doesn't render a timer", () => {
      const { queryByLabelText } = renderWithWrappers(
        <TestWrapper bidderPositionResult={Statuses.live_bidding_started} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => sale,
      })

      expect(queryByLabelText("Countdown")).toBeFalsy()
    })

    it("dismisses controller and presents live interface when continue button is pressed", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper bidderPositionResult={Statuses.live_bidding_started} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Sale: () => sale,
      })

      fireEvent.press(getByText("Continue"))
      jest.runAllTicks()

      expect(navigate).toHaveBeenCalledWith("https://live-staging.artsy.net/sale-id", {
        modal: true,
      })
    })
  })
})

const positionPlaceholder = {
  id: "",
  suggested_next_bid: {
    cents: "",
    display: "",
  },
}

const winningStatus: BidderPositionResult = {
  status: "WINNING",
  message_header: "",
  message_description_md: "",
  position: positionPlaceholder,
}

const outbidStatus: BidderPositionResult = {
  status: "OUTBID",
  message_header: "Your bid wasn’t high enough",
  message_description_md: `
    Another bidder placed a higher max bid or the same max bid before you did.
  `,
  position: positionPlaceholder,
}

const liveBiddingStartedStatus: BidderPositionResult = {
  status: "LIVE_BIDDING_STARTED",
  message_header: "Live bidding has started",
  message_description_md: `
    Sorry, your bid wasn’t received before live bidding started.
    To continue bidding, please [join the live auction](http://live-staging.artsy.net/).
  `,
  position: positionPlaceholder,
}

const Statuses = {
  winning: winningStatus,
  outbid: outbidStatus,
  live_bidding_started: liveBiddingStartedStatus,
}
