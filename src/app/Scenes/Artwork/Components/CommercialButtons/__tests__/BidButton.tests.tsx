import { screen } from "@testing-library/react-native"
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
    it("does not display anything", async () => {
      const { toJSON } = await renderWithWrappers(
        <TestWrapper auctionState={"hasEnded" as AuctionTimerState} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ArtworkFromClosedAuction,
        Me: () => meFixture,
      })

      expect(toJSON()).toBeNull()
    })
  })

  describe("for auction preview", () => {
    it("and not registered bidder", async () => {
      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.PREVIEW} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ArtworkFromAuctionPreview,
        Me: () => meFixture,
      })

      expect(screen.getByText("Register to bid")).toBeOnTheScreen()
    })

    it("displays 'Identity verification is required' if the sale requires identity verification but the user is not verified", async () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, {
        sale: { requireIdentityVerification: true },
      })
      const me = {
        isIdentityVerified: false,
      }

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.PREVIEW} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artworkWithIDVRequired,
        Me: () => me,
      })

      expect(screen.getByText("Register to bid")).toBeOnTheScreen()
      expect(screen.getByText(/Identity verification required to bid./)).toBeOnTheScreen()
    })

    it("does not display 'Identity verification is required' if the sale requires identity verification and the user is verified", async () => {
      const artworkWithIDVRequired = merge({}, ArtworkFromAuctionPreview, {
        sale: { requireIdentityVerification: true },
      })
      const me = { isIdentityVerified: true }

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.PREVIEW} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artworkWithIDVRequired,
        Me: () => me,
      })

      expect(screen.getByText("Register to bid")).toBeOnTheScreen()
      expect(screen.queryByText("Identity verification required to bid.")).not.toBeOnTheScreen()
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, BidderPendingApproval)

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.PREVIEW} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Registration Pending")).toBeOnTheScreen()
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromAuctionPreview, RegisteredBidder)

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.PREVIEW} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Registration complete")).toBeOnTheScreen()
    })
  })

  describe("for open, timed auction", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, NotRegisteredToBid)

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Bid")).toBeOnTheScreen()
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationClosed, NotRegisteredToBid)

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Registration closed")).toBeOnTheScreen()
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, BidderPendingApproval)

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Registration Pending")).toBeOnTheScreen()
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegisteredBidder)

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Bid")).toBeOnTheScreen()
    })

    it("with registered bidder with bids", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegistedBidderWithBids)

      await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Increase max bid")).toBeOnTheScreen()
    })

    describe("and sale requires identity verification", () => {
      const lotWithIDVRequired = merge({}, ArtworkFromTimedAuctionRegistrationOpen, {
        sale: { requireIdentityVerification: true },
      })

      it("displays 'Register to bid' if the user is not verified", async () => {
        const me = { isIdentityVerified: false }

        await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(screen.getByText("Register to bid")).toBeOnTheScreen()
        expect(screen.getByText(/Identity verification required to bid./)).toBeOnTheScreen()
      })

      it("displays 'Bid' if the user is verified", async () => {
        const me = { isIdentityVerified: true }

        await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(screen.getByText("Bid")).toBeOnTheScreen()
        expect(screen.queryByText("Identity verification required to bid.")).not.toBeOnTheScreen()
      })

      it("displays 'Bid' if the user is not verified but manually approved", async () => {
        const artwork = merge(lotWithIDVRequired, {
          sale: {
            registrationStatus: {
              qualifiedForBidding: true,
            },
          },
        })
        const me = { isIdentityVerified: false }

        await renderWithWrappers(<TestWrapper auctionState={AuctionTimerState.CLOSING} />)

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => artwork,
          Me: () => me,
        })

        expect(screen.getByText("Bid")).toBeOnTheScreen()
        expect(screen.queryByText("Identity verification required to bid.")).not.toBeOnTheScreen()
      })
    })
  })

  describe("for open, live auction during pre-bidding", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, NotRegisteredToBid)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Bid")).toBeOnTheScreen()
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationClosed, NotRegisteredToBid)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Registration closed")).toBeOnTheScreen()
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, BidderPendingApproval)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Registration Pending")).toBeOnTheScreen()
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegisteredBidder)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Bid")).toBeOnTheScreen()
    })

    it("with registered bidder with bids", async () => {
      const artwork = merge({}, ArtworkFromTimedAuctionRegistrationOpen, RegistedBidderWithBids)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Increase max bid")).toBeOnTheScreen()
    })

    describe("and sale requires identity verification", () => {
      const lotWithIDVRequired = merge({}, ArtworkFromTimedAuctionRegistrationOpen, {
        sale: { requireIdentityVerification: true },
      })

      it("displays 'Register to bid' if the user is not verified", async () => {
        const me = { isIdentityVerified: false }

        await renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
        )

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(screen.getByText("Register to bid")).toBeOnTheScreen()
        expect(screen.getByText(/Identity verification required to bid./)).toBeOnTheScreen()
      })

      it("displays 'Bid' if the user is verified", async () => {
        const me = { isIdentityVerified: true }

        await renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
        )

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => lotWithIDVRequired,
          Me: () => me,
        })

        expect(screen.getByText("Bid")).toBeOnTheScreen()
        expect(screen.queryByText("Identity verification required to bid.")).not.toBeOnTheScreen()
      })

      it("displays 'Bid' if the user is not verified but manually approved", async () => {
        const artwork = merge(lotWithIDVRequired, {
          sale: {
            registrationStatus: {
              qualifiedForBidding: true,
            },
          },
        })
        const me = { isIdentityVerified: false }

        await renderWithWrappers(
          <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_UPCOMING} />
        )

        await resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => artwork,
          Me: () => me,
        })

        expect(screen.getByText("Bid")).toBeOnTheScreen()
        expect(screen.queryByText("Identity verification required to bid.")).not.toBeOnTheScreen()
      })
    })
  })

  describe("for live auction", () => {
    it("with open registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, NotRegisteredToBid)
      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Enter live bidding")).toBeOnTheScreen()
    })

    it("with closed registration and not registered bidder ", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationClosed, NotRegisteredToBid)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Registration closed")).toBeOnTheScreen()
      expect(screen.getByText("Watch live bidding")).toBeOnTheScreen()
    })

    it("with bidder registration pending approval", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, BidderPendingApproval)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Enter live bidding")).toBeOnTheScreen()
    })

    it("with registered bidder", async () => {
      const artwork = merge({}, ArtworkFromLiveAuctionRegistrationOpen, RegisteredBidder)

      await renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
        Me: () => meFixture,
      })

      expect(screen.getByText("Enter live bidding")).toBeOnTheScreen()
    })
  })
})
