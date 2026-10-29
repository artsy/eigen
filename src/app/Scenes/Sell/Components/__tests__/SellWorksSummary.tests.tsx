import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellWorksSummaryTestsQuery } from "__generated__/SellWorksSummaryTestsQuery.graphql"
import { SellWorksSummary } from "app/Scenes/Sell/Components/SellWorksSummary"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SellWorksSummary", () => {
  const onStartWork = jest.fn()

  const { renderWithRelay } = setupTestWrapper<SellWorksSummaryTestsQuery>({
    Component: ({ me }) => (
      <SellWorksSummary
        works={extractNodes(me?.myCollectionConnection)}
        onStartWork={onStartWork}
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

  // getSellChannel treats an even second-last hex digit as a marketplace work, odd as an auction
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
    expect(onStartWork).toHaveBeenCalledWith("id-b4")

    fireEvent.press(screen.getByText("Start Listing"))
    expect(onStartWork).toHaveBeenCalledWith("id-a2")
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
