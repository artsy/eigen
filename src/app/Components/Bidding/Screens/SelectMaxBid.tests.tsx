import { screen } from "@testing-library/react-native"
import { SelectMaxBidTestsQuery } from "__generated__/SelectMaxBidTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { SelectMaxBid, SelectMaxBidContainer } from "./SelectMaxBid"

describe("SelectMaxBid", () => {
  const { renderWithRelay } = setupTestWrapper<SelectMaxBidTestsQuery>({
    Component: ({ me, sale_artwork }) => (
      <SelectMaxBidContainer me={me!} sale_artwork={sale_artwork!} navigator={null!} />
    ),
    query: graphql`
      query SelectMaxBidTestsQuery($saleID: String!) @relay_test_operation {
        sale_artwork: saleArtwork(id: "wow") {
          ...SelectMaxBid_sale_artwork
        }
        me {
          ...SelectMaxBid_me
        }
      }
    `,
  })

  it("renders without throwing an error", () => {
    renderWithRelay()

    expect(screen.queryByTestId("spinner")).toBeFalsy()

    // shows a spinner while fetching new bid increments
    screen.UNSAFE_getByType(SelectMaxBid).instance._test_refreshSaleArtwork(true) // hacky way to call this, but its an old component that needs refactoring
    expect(screen.queryByTestId("spinner")).toBeTruthy()

    // removes the spinner once the refetch is complete
    screen.UNSAFE_getByType(SelectMaxBid).instance._test_refreshSaleArtwork(false) // hacky way to call this, but its an old component that needs refactoring
    expect(screen.queryByTestId("spinner")).toBeFalsy()
  })
})
