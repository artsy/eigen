import { fireEvent, screen } from "@testing-library/react-native"
import { MyCollectionListingsTestsQuery } from "__generated__/MyCollectionListingsTestsQuery.graphql"
import {
  MyCollectionListings,
  MyCollectionListingsEmptyState,
} from "app/Scenes/MyCollection/MyCollectionListings"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const submission = (
  state: string,
  overrides: { id: string; channel?: string; statusMessage?: string; artistNames?: string }
) => ({
  node: {
    internalID: overrides.id,
    state,
    statusMessage: overrides.statusMessage ?? "Status message",
    channel: overrides.channel ?? "MARKETPLACE",
    submittedArtwork: {
      slug: `artwork-${overrides.id}`,
      artistNames: overrides.artistNames ?? "Artist Name",
      title: `Title ${overrides.id}`,
      date: "2020",
      image: null,
    },
  },
})

describe("MyCollectionListings", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionListingsTestsQuery>({
    Component: ({ me }) => <MyCollectionListings me={me} />,
    query: graphql`
      query MyCollectionListingsTestsQuery @relay_test_operation {
        me @required(action: NONE) {
          ...MyCollectionListings_me
        }
      }
    `,
  })

  it("renders artist, title, status message and channel for each submission", async () => {
    await renderWithRelay({
      Me: () => ({
        resaleSubmissionsConnection: {
          edges: [
            submission("LISTED", {
              id: "1",
              artistNames: "Pablo Picasso",
              statusMessage: "Your work is listed",
              channel: "MARKETPLACE",
            }),
            submission("AUCTION_REVIEW", {
              id: "2",
              artistNames: "Andy Warhol",
              statusMessage: "In review for auction",
              channel: "AUCTION",
            }),
          ],
        },
      }),
    })

    expect(screen.getAllByTestId("my-collection-listing-row")).toHaveLength(2)
    expect(screen.getByText("Pablo Picasso")).toBeOnTheScreen()
    expect(screen.getByText("Title 1")).toBeOnTheScreen()
    expect(screen.getByText("Your work is listed")).toBeOnTheScreen()
    expect(screen.getByText("Artsy Listing")).toBeOnTheScreen()
    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("In review for auction")).toBeOnTheScreen()
    expect(screen.getByText("Artnet Auction")).toBeOnTheScreen()
    expect(screen.queryByText("Thought about selling?")).not.toBeOnTheScreen()
  })

  it("shows a status dot for accepted, listed and in-review submissions", async () => {
    await renderWithRelay({
      Me: () => ({
        resaleSubmissionsConnection: {
          edges: [
            submission("ACCEPTED", { id: "1" }),
            submission("LISTED", { id: "2" }),
            submission("AUCTION_REVIEW", { id: "3" }),
          ],
        },
      }),
    })

    expect(screen.getAllByTestId("listing-state-dot")).toHaveLength(3)
  })

  it("hides canceled and rejected submissions", async () => {
    await renderWithRelay({
      Me: () => ({
        resaleSubmissionsConnection: {
          edges: [
            submission("LISTED", { id: "1", statusMessage: "Your work is listed" }),
            submission("CANCELED", { id: "2", statusMessage: "Canceled message" }),
            submission("REJECTED", { id: "3", statusMessage: "Rejected message" }),
          ],
        },
      }),
    })

    expect(screen.getAllByTestId("my-collection-listing-row")).toHaveLength(1)
    expect(screen.getByText("Your work is listed")).toBeOnTheScreen()
    expect(screen.queryByText("Canceled message")).not.toBeOnTheScreen()
    expect(screen.queryByText("Rejected message")).not.toBeOnTheScreen()
  })

  it("shows the empty state when there are no submissions", async () => {
    await renderWithRelay({
      Me: () => ({ resaleSubmissionsConnection: { edges: [] } }),
    })

    expect(screen.getByText("Thought about selling?")).toBeOnTheScreen()
    expect(screen.queryByTestId("my-collection-listing-row")).not.toBeOnTheScreen()
  })

  it("shows the empty state when every submission is filtered out", async () => {
    await renderWithRelay({
      Me: () => ({
        resaleSubmissionsConnection: {
          edges: [submission("CANCELED", { id: "1" }), submission("REJECTED", { id: "2" })],
        },
      }),
    })

    expect(screen.getByText("Thought about selling?")).toBeOnTheScreen()
    expect(screen.queryByTestId("my-collection-listing-row")).not.toBeOnTheScreen()
  })
})

describe("MyCollectionListingsEmptyState", () => {
  it("invites the collector to sell and opens the sell flow", async () => {
    await renderWithWrappers(<MyCollectionListingsEmptyState />)

    expect(screen.getByText("Thought about selling?")).toBeOnTheScreen()
    expect(screen.getByText("BETA")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Sell With Us"))

    expect(navigate).toHaveBeenCalledWith("/my-collection/sell")
  })
})
