import { act, fireEvent, screen } from "@testing-library/react-native"
import { ListingRow_resaleSubmission$data } from "__generated__/ListingRow_resaleSubmission.graphql"
import { MyCollectionListingsTestsQuery } from "__generated__/MyCollectionListingsTestsQuery.graphql"
import {
  MyCollectionListings,
  MyCollectionListingsEmptyState,
  MyCollectionListingsQueryRenderer,
} from "app/Scenes/MyCollection/MyCollectionListings"
import { navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MockPayloadGenerator } from "relay-test-utils"

type ResaleSubmissionNode = Omit<ListingRow_resaleSubmission$data, " $fragmentType"> & {
  internalID: string
}

const resaleSubmission = (
  state: ResaleSubmissionNode["state"],
  overrides: {
    id: string
    channel?: ResaleSubmissionNode["channel"]
    statusMessage?: string
    artistNames?: string
  }
): { node: ResaleSubmissionNode } => ({
  node: {
    internalID: overrides.id,
    state,
    statusMessage: overrides.statusMessage ?? "Status message",
    channel: overrides.channel ?? "MARKETPLACE",
    submittedArtwork: {
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
            resaleSubmission("LISTED", {
              id: "1",
              artistNames: "Pablo Picasso",
              statusMessage: "Your work is listed",
              channel: "MARKETPLACE",
            }),
            resaleSubmission("AUCTION_REVIEW", {
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

  it("opens the listing when a row is tapped", async () => {
    await renderWithRelay({
      Me: () => ({
        resaleSubmissionsConnection: {
          edges: [resaleSubmission("LISTED", { id: "submission-7" })],
        },
      }),
    })

    await fireEvent.press(screen.getByTestId("my-collection-listing-row"))

    expect(navigate).toHaveBeenCalledWith("/my-collection/resale-submissions/submission-7")
  })

  it("shows canceled and rejected submissions", async () => {
    await renderWithRelay({
      Me: () => ({
        resaleSubmissionsConnection: {
          edges: [
            resaleSubmission("CANCELED", { id: "1", statusMessage: "Canceled message" }),
            resaleSubmission("REJECTED", { id: "2", statusMessage: "Rejected message" }),
          ],
        },
      }),
    })

    expect(screen.getAllByTestId("my-collection-listing-row")).toHaveLength(2)
    expect(screen.getByText("Canceled message")).toBeOnTheScreen()
    expect(screen.getByText("Rejected message")).toBeOnTheScreen()
  })

  it("shows the empty state when there are no submissions", async () => {
    await renderWithRelay({
      Me: () => ({ resaleSubmissionsConnection: { edges: [] } }),
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

describe("MyCollectionListingsQueryRenderer", () => {
  it("keeps the rows on screen while My Collection refreshes", async () => {
    const env = getMockRelayEnvironment()

    await renderWithWrappers(<MyCollectionListingsQueryRenderer />)

    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({
            resaleSubmissionsConnection: {
              edges: [
                resaleSubmission("LISTED", { id: "1", statusMessage: "Your work is listed" }),
              ],
            },
          }),
        })
      )
    })
    expect(await screen.findByText("Your work is listed")).toBeOnTheScreen()

    await act(() => refreshMyCollection())

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "MyCollectionListingsRefetchQuery"
    )
    expect(screen.getByText("Your work is listed")).toBeOnTheScreen()
  })

  it("shows the failure view when me is null", async () => {
    const env = getMockRelayEnvironment()

    await renderWithWrappers(<MyCollectionListingsQueryRenderer />)

    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, { Query: () => ({ me: null }) })
      )
    })

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
  })

  it("shows the failure view when the submissions connection is null", async () => {
    const env = getMockRelayEnvironment()

    await renderWithWrappers(<MyCollectionListingsQueryRenderer />)

    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, {
          Me: () => ({ resaleSubmissionsConnection: null }),
        })
      )
    })

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
  })
})
