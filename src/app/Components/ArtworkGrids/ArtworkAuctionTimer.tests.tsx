import { screen } from "@testing-library/react-native"
import { ArtworkAuctionTimer_Test_Query } from "__generated__/ArtworkAuctionTimer_Test_Query.graphql"
import { ArtworkAuctionTimer } from "app/Components/ArtworkGrids/ArtworkAuctionTimer"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

describe("ArtworkAuctionTimer", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkAuctionTimer_Test_Query>({
    Component: (props) => (
      <ArtworkAuctionTimer collectorSignals={props.artwork?.collectorSignals!} {...props} />
    ),
    query: graphql`
      query ArtworkAuctionTimer_Test_Query {
        artwork(id: "artwork-id") {
          collectorSignals {
            ...ArtworkAuctionTimer_collectorSignals
          }
        }
      }
    `,
  })

  it("renders registration ends at", () => {
    const registerDate = DateTime.fromMillis(Date.now()).plus({ days: 1 })

    renderWithRelay({
      Artwork: () => ({
        collectorSignals: {
          auction: {
            registrationEndsAt: registerDate.toISO(),
          },
        },
      }),
    })

    expect(screen.getByText(`Register by ${registerDate.toFormat("MMM d")}`)).toBeOnTheScreen()
  })

  it('hides "Register by" when hideRegisterBySignal is true', () => {
    const registerDate = DateTime.fromMillis(Date.now()).plus({ days: 1 })

    renderWithRelay(
      {
        Artwork: () => ({
          collectorSignals: {
            auction: {
              registrationEndsAt: registerDate.toISO(),
            },
          },
        }),
      },
      { hideRegisterBySignal: true }
    )

    expect(
      screen.queryByText(`Register by ${registerDate.toFormat("MMM d")}`)
    ).not.toBeOnTheScreen()
  })

  it("shows the time left to bid", () => {
    renderWithRelay({
      Artwork: () => ({
        collectorSignals: {
          auction: {
            lotClosesAt: DateTime.fromMillis(Date.now()).plus({ days: 1 }).toISO(),
            onlineBiddingExtended: false,
          },
        },
      }),
    })

    expect(screen.getByText("23h 59m left to bid")).toBeOnTheScreen()
  })

  it("shows the time left to bid when online bidding is extended", () => {
    renderWithRelay({
      Artwork: () => ({
        collectorSignals: {
          auction: {
            lotClosesAt: DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO(),
            onlineBiddingExtended: true,
          },
        },
      }),
    })

    expect(screen.getByText("Extended, 1m left")).toBeOnTheScreen()
  })

  it("does not render when the lot closes at is more than 5 days away", () => {
    renderWithRelay({
      Artwork: () => ({
        collectorSignals: {
          auction: {
            lotClosesAt: DateTime.fromMillis(Date.now()).plus({ days: 6 }).toISO(),
            onlineBiddingExtended: false,
          },
        },
      }),
    })

    expect(screen.queryByText("23h 59m left to bid")).not.toBeOnTheScreen()
  })
})
