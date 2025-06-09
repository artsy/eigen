import { fireEvent, screen } from "@testing-library/react-native"
import { SelectMaxBidTestsQuery } from "__generated__/SelectMaxBidTestsQuery.graphql"
import { BidFlowContextProvider } from "app/Components/Bidding/Context/BidFlowContextProvider"
import { SelectMaxBid } from "app/Components/Bidding/Screens/SelectMaxBid"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SelectMaxBid", () => {
  const mockNavigator = { navigate: jest.fn() }

  const { renderWithRelay } = setupTestWrapper<SelectMaxBidTestsQuery>({
    Component: ({ me, saleArtwork }) => (
      <BidFlowContextProvider>
        <SelectMaxBid
          me={me!}
          saleArtwork={saleArtwork!}
          navigation={mockNavigator as any}
          route={null!}
        />
      </BidFlowContextProvider>
    ),
    query: graphql`
      query SelectMaxBidTestsQuery @relay_test_operation {
        saleArtwork(id: "wow") {
          ...SelectMaxBid_saleArtwork
        }
        me {
          ...SelectMaxBid_me
        }
      }
    `,
  })

  it("can update the max bid", async () => {
    renderWithRelay({
      SaleArtwork: () => ({
        increments: [
          { display: "£100", cents: 10000 },
          { display: "£200", cents: 20000 },
          { display: "£300", cents: 30000 },
        ],
      }),
    })

    expect(screen.getByText("£100")).toBeOnTheScreen()

    expect(screen.queryByTestId("modal-max-bid")).not.toBeVisible()

    // open the modal
    fireEvent.press(screen.getByTestId("max-bid"))

    await screen.findByTestId("modal-max-bid")

    // expect(screen.getByText("£100")).toBeOnTheScreen()
    expect(screen.getByText("£200")).toBeOnTheScreen()
    expect(screen.getByText("£300")).toBeOnTheScreen()

    // select a new max bid
    fireEvent.press(screen.getByText("£200"))

    expect(screen.queryByTestId("modal-max-bid")).not.toBeVisible()

    expect(screen.queryByText("£100")).not.toBeOnTheScreen()
    expect(screen.getByText("£200")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Next"))

    expect(mockNavigator.navigate).toHaveBeenCalledWith("ConfirmBid", {
      refreshSaleArtwork: expect.any(Function),
      me: expect.any(Object),
      saleArtwork: expect.objectContaining({
        increments: [
          { cents: 10000, display: "£100" },
          { cents: 20000, display: "£200" },
          { cents: 30000, display: "£300" },
        ],
      }),
    })
  })
})
