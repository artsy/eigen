import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MyCollectionListingRow_resaleSubmission$data } from "__generated__/MyCollectionListingRow_resaleSubmission.graphql"
import { MyCollectionListingsTestsQuery } from "__generated__/MyCollectionListingsTestsQuery.graphql"
import {
  MyCollectionListings,
  MyCollectionListingsEmptyState,
  MyCollectionListingsQueryRenderer,
} from "app/Scenes/MyCollection/MyCollectionListings"
import { navigate } from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const ORANGE_100 = "#DA6722"
const GREEN_100 = "#00674A"

const submission = (
  state: MyCollectionListingRow_resaleSubmission$data["state"],
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

  it("colours the status dot by state", async () => {
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

    const dots = screen.getAllByTestId("listing-state-dot")
    expect(dots).toHaveLength(3)
    expect(dots[0]).toHaveStyle({ backgroundColor: ORANGE_100 })
    expect(dots[1]).toHaveStyle({ backgroundColor: GREEN_100 })
    expect(dots[2]).toHaveStyle({ backgroundColor: GREEN_100 })
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

  describe("when every loaded submission is hidden but another page exists", () => {
    const hiddenPage = {
      Me: () => ({
        id: "me-id",
        resaleSubmissionsConnection: {
          edges: [submission("CANCELED", { id: "1" })],
          pageInfo: { hasNextPage: true, endCursor: "cursor-1" },
        },
      }),
    }

    it("loads the next page and shows its rows", async () => {
      const { mockResolveLastOperation } = await renderWithRelay(hiddenPage)

      await mockResolveLastOperation({
        Me: () => ({
          id: "me-id",
          resaleSubmissionsConnection: {
            edges: [submission("LISTED", { id: "2", statusMessage: "Your work is listed" })],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        }),
      })

      expect(await screen.findByText("Your work is listed")).toBeOnTheScreen()
      expect(screen.queryByText("Thought about selling?")).not.toBeOnTheScreen()
    })

    it("stops loading after an error and shows the empty state", async () => {
      const { env, mockRejectLastOperation } = await renderWithRelay(hiddenPage)

      await mockRejectLastOperation(new Error("Network error"))

      expect(await screen.findByText("Thought about selling?")).toBeOnTheScreen()
      expect(env.mock.getAllOperations()).toHaveLength(0)
    })
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

describe("MyCollectionListingsQueryRenderer", () => {
  it("shows the failure view when the query fails and refetches on retry", async () => {
    const env = getMockRelayEnvironment()

    await renderWithWrappers(<MyCollectionListingsQueryRenderer />)

    await act(() => {
      env.mock.rejectMostRecentOperation(new Error("Network request failed"))
    })

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
    expect(env.mock.getAllOperations()).toHaveLength(0)

    await fireEvent.press(screen.getByLabelText("Retry"))

    await waitFor(() =>
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "MyCollectionListingsQuery"
      )
    )
  })
})
