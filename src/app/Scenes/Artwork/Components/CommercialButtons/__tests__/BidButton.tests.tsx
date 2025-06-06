import { BidButtonTestsQuery } from "__generated__/BidButtonTestsQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { BidButtonFragmentContainer as BidButton } from "app/Scenes/Artwork/Components/CommercialButtons/BidButton"
import {
  ArtworkFromAuctionPreview,
  ArtworkFromClosedAuction,
  ArtworkFromLiveAuctionRegistrationClosed,
  ArtworkFromLiveAuctionRegistrationOpen,
  ArtworkFromTimedAuctionRegistrationClosed,
  ArtworkFromTimedAuctionRegistrationOpen,
  BidderPendingApproval,
  NotRegisteredToBid,
  RegistedBidderWithBids,
  RegisteredBidder,
} from "app/__fixtures__/ArtworkBidAction"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { merge as _merge } from "lodash"
import { Settings } from "luxon"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

const merge: (...args: object[]) => any = _merge

const realNow = Settings.now
const realDefaultZone = Settings.defaultZone

const meFixture: BidButtonTestsQuery["rawResponse"]["me"] = {
  id: "id",
  isIdentityVerified: false,
}

interface WrapperProps {
  auctionState: AuctionTimerState
}

describe("BidButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeAll(() => {
    Settings.defaultZone = "America/New_York"
    Settings.now = () => new Date("2019-08-15T12:00:00+00:00").valueOf()

    mockEnvironment = createMockEnvironment()
  })

  afterAll(() => {
    Settings.now = realNow
    Settings.defaultZone = realDefaultZone
  })

  const TestWrapper = (props: WrapperProps) => {
    return (
      <QueryRenderer<BidButtonTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query BidButtonTestsQuery @relay_test_operation @raw_response_type {
            artwork(id: "auction_artwork") {
              ...BidButton_artwork
            }
            me {
              ...BidButton_me
            }
          }
        `}
        variables={{}}
        render={({ props: relayProps }) => {
          if (relayProps?.artwork && relayProps.me) {
            return (
              <BidButton
                me={relayProps.me}
                artwork={relayProps.artwork}
                auctionState={props.auctionState as AuctionTimerState}
              />
            )
          }
          return null
        }}
      />
    )
  }

  describe("for closed auction", () => {
    it("does not display anything", () => {
      const { toJSON } = renderWithWrappers(
        <TestWrapper auctionState={"hasEnded" as AuctionTimerState} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ArtworkFromClosedAuction,
        Me: () => meFixture,
      })

      expect(toJSON()).toBeNull()
    })
  })

  describe("for auction preview", () => {
    it("and not registered bidder", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.PREVIEW} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ArtworkFromAuctionPreview,
        Me: () => meFixture,
      })

      expect(getByText("Register to bid")).toBeTruthy()
    })

    it("displays 'Identity verification is required' if the sale requires identity verification but the user is not verified", () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, {
        sale: { requireIdentityVerification: true },
      })
      const me = {
        isIdentityVerified: false,
      }

      const { queryByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.PREVIEW} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artworkWithIDVRequired,
        Me: () => me,
      })

      expect(queryByText("Register to bid")).toBeTruthy()
      expect(queryByText(/Identity verification required to bid./)).toBeTruthy()
    })

    it("does not display 'Identity verification is required' if the sale requires identity verification and the user is verified", () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, {
        sale: { requireIdentityVerification: true },
      })
      const me = { isIdentityVerified: true }

      const { getByText, queryByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.PREVIEW} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artworkWithIDVRequired,
        Me: () => me,
      })

      expect(getByText("Register to bid")).toBeTruthy()
      expect(queryByText("Identity verification required to bid.")).toBeFalsy()
    })

    it("with bidder registration pending approval", () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, BidderPendingApproval)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.PREVIEW} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Registration Pending")).toBeTruthy()
    })

    it("with registered bidder", () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, RegisteredBidder)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.PREVIEW} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Registration complete")).toBeTruthy()
    })
  })

  describe("for open, timed auction", () => {
    it("with open registration and not registered bidder ", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, NotRegisteredToBid)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Bid")).toBeTruthy()
    })

    it("with closed registration and not registered bidder ", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationClosed, NotRegisteredToBid)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Registration closed")).toBeTruthy()
    })

    it("with bidder registration pending approval", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, BidderPendingApproval)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Registration Pending")).toBeTruthy()
    })

    it("with registered bidder", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegisteredBidder)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Bid")).toBeTruthy()
    })

    it("with registered bidder with bids", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegistedBidderWithBids)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Increase max bid")).toBeTruthy()
    })

    describe("and sale requires identity verification", () => {
      const lotWithIDVRequired = merge({}, ArtworkFromTimedAuctionRegistrationOpen, {
        sale: { requireIdentityVerification: true },
      })

      it("displays 'Register to bid' if the user is not verified", () => {
        const me = { isIdentityVerified: false }

        const { getByText } = renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.CLOSING} />
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(getByText("Register to bid")).toBeTruthy()
        expect(getByText(/Identity verification required to bid./)).toBeTruthy()
      })

      it("displays 'Bid' if the user is verified", () => {
        const me = { isIdentityVerified: true }

        const { getByText, queryByText } = renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.CLOSING} />
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(getByText("Bid")).toBeTruthy()
        expect(queryByText("Identity verification required to bid.")).toBeFalsy()
      })

      it("displays 'Bid' if the user is not verified but manually approved", () => {
        const artwork = merge(lotWithIDVRequired, {
          sale: {
            registrationStatus: {
              qualifiedForBidding: true,
            },
          },
        })
        const me = { isIdentityVerified: false }

        const { getByText, queryByText } = renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.CLOSING} />
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => artwork,
          Me: () => me,
        })

        expect(getByText("Bid")).toBeTruthy()
        expect(queryByText("Identity verification required to bid.")).toBeFalsy()
      })
    })
  })

  describe("for open, live auction during pre-bidding", () => {
    it("with open registration and not registered bidder ", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, NotRegisteredToBid)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Bid")).toBeTruthy()
    })

    it("with closed registration and not registered bidder ", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationClosed, NotRegisteredToBid)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Registration closed")).toBeTruthy()
    })

    it("with bidder registration pending approval", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, BidderPendingApproval)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Registration Pending")).toBeTruthy()
    })

    it("with registered bidder", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegisteredBidder)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Bid")).toBeTruthy()
    })

    it("with registered bidder with bids", () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegistedBidderWithBids)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Increase max bid")).toBeTruthy()
    })

    describe("and sale requires identity verification", () => {
      const lotWithIDVRequired = merge({}, ArtworkFromTimedAuctionRegistrationOpen, {
        sale: { requireIdentityVerification: true },
      })

      it("displays 'Register to bid' if the user is not verified", () => {
        const me = { isIdentityVerified: false }

        const { getByText } = renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(getByText("Register to bid")).toBeTruthy()
        expect(getByText(/Identity verification required to bid./)).toBeTruthy()
      })

      it("displays 'Bid' if the user is verified", () => {
        const me = { isIdentityVerified: true }

        const { getByText, queryByText } = renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(getByText("Bid")).toBeTruthy()
        expect(queryByText("Identity verification required to bid.")).toBeFalsy()
      })

      it("displays 'Bid' if the user is not verified but manually approved", () => {
        const artwork = merge(lotWithIDVRequired, {
          sale: {
            registrationStatus: {
              qualifiedForBidding: true,
            },
          },
        })
        const me = { isIdentityVerified: false }

        const { getByText, queryByText } = renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => artwork,
          Me: () => me,
        })

        expect(getByText("Bid")).toBeTruthy()
        expect(queryByText("Identity verification required to bid.")).toBeFalsy()
      })
    })
  })

  describe("for live auction", () => {
    it("with open registration and not registered bidder ", () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, NotRegisteredToBid)
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Enter live bidding")).toBeTruthy()
    })

    it("with closed registration and not registered bidder ", () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationClosed, NotRegisteredToBid)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Registration closed")).toBeTruthy()
      expect(getByText("Watch live bidding")).toBeTruthy()
    })

    it("with bidder registration pending approval", () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, BidderPendingApproval)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Enter live bidding")).toBeTruthy()
    })

    it("with registered bidder", () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, RegisteredBidder)

      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(getByText("Enter live bidding")).toBeTruthy()
    })
  })
})
