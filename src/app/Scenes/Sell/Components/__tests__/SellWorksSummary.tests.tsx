import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellWorksSummaryTestsQuery } from "__generated__/SellWorksSummaryTestsQuery.graphql"
import { SellWorksSummary } from "app/Scenes/Sell/Components/SellWorksSummary"
import { ResaleSubmissionWithChannel } from "app/Scenes/Sell/utils/resaleSubmission"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

const RESALE_SUBMISSIONS: Record<string, ResaleSubmissionWithChannel> = {
  "id-a2": {
    internalID: "s-1",
    state: "ACCEPTED",
    channel: "MARKETPLACE",
    estimate: null,
    statusMessage: "In progress",
  },
  "id-b4": {
    internalID: "s-2",
    state: "ACCEPTED",
    channel: "AUCTION",
    estimate: null,
    statusMessage: "In progress",
  },
}

describe("SellWorksSummary", () => {
  const onStartSelling = jest.fn()

  const { renderWithRelay } = setupTestWrapper<SellWorksSummaryTestsQuery>({
    Component: ({ me }) => (
      <SellWorksSummary
        works={extractNodes(me?.myCollectionConnection).map((artwork) => ({
          artwork,
          resaleSubmission: RESALE_SUBMISSIONS[artwork.internalID],
        }))}
        onStartSelling={onStartSelling}
      />
    ),
    query: graphql`
      query SellWorksSummaryTestsQuery @relay_test_operation {
        me {
          myCollectionConnection(first: 10) {
            edges {
              node {
                internalID
                ...SellWorkCard_artwork
              }
            }
          }
        }
      }
    `,
  })

  const collection = {
    Me: () => ({
      myCollectionConnection: {
        edges: [
          { node: { internalID: "id-a2", artistNames: "Listing Artist" } },
          { node: { internalID: "id-b4", artistNames: "Auction Artist" } },
        ],
      },
    }),
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("gives each work the button for its sales channel", () => {
    renderWithRelay(collection)

    expect(screen.getByText("Listing Artist")).toBeOnTheScreen()
    expect(screen.getByText("Auction Artist")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Start Submission"))
    expect(onStartSelling).toHaveBeenCalledWith(
      expect.objectContaining({ resaleSubmission: expect.objectContaining({ internalID: "s-2" }) })
    )

    fireEvent.press(screen.getByText("Start Listing"))
    expect(onStartSelling).toHaveBeenCalledWith(
      expect.objectContaining({ resaleSubmission: expect.objectContaining({ internalID: "s-1" }) })
    )
  })

  it("explains the sales channels", async () => {
    renderWithRelay(collection)

    fireEvent.press(screen.getByLabelText("About sales channels"))
    expect(await screen.findByText("Sales channels")).toBeOnTheScreen()
    expect(screen.getByText("Marketplace")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Got it"))
    await waitFor(() => expect(screen.queryByText("Sales channels")).not.toBeOnTheScreen())
  })
})
