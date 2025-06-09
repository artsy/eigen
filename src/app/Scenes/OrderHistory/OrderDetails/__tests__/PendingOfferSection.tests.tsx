import { screen } from "@testing-library/react-native"
import { PendingOfferSectionTestsQuery } from "__generated__/PendingOfferSectionTestsQuery.graphql"
import { PendingOfferSection } from "app/Scenes/OrderHistory/OrderDetails/Components/PendingOfferSection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PendingOfferSection", () => {
  const { renderWithRelay } = setupTestWrapper<PendingOfferSectionTestsQuery>({
    Component: (props) => <PendingOfferSection order={props.commerceOrder!} />,
    query: graphql`
      query PendingOfferSectionTestsQuery @relay_test_operation {
        commerceOrder(id: "some-id") {
          ...PendingOfferSection_order
        }
      }
    `,
  })

  it("renders the pending offer section", () => {
    renderWithRelay({ CommerceOrder: () => ({ stateExpiresAt: "May 1" }) })

    expect(
      screen.getByText(
        "The seller will respond to your offer by May 1. Keep in mind making an offer doesn’t guarantee you the work."
      )
    ).toBeOnTheScreen()
  })

  it("does not render the pending offer section if stateExpiresAt is null", () => {
    renderWithRelay({ CommerceOrder: () => ({ stateExpiresAt: null }) })

    expect(
      screen.queryByText("The seller will respond to your offer by May 1")
    ).not.toBeOnTheScreen()
  })
})
