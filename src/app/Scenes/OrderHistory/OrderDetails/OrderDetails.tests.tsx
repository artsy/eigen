import { OrderDetailsTestsQuery } from "__generated__/OrderDetailsTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { SectionList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { ArtworkInfoSectionFragmentContainer } from "./Components/ArtworkInfoSection"
import {
  OrderDetailsContainer,
  OrderDetailsPlaceholder,
  OrderDetailsQueryRender,
  SectionListItem,
} from "./Components/OrderDetails"
import { OrderDetailsHeaderFragmentContainer } from "./Components/OrderDetailsHeader"
import { CreditCardSummaryItemFragmentContainer } from "./Components/OrderDetailsPayment"
import { ShipsToSectionFragmentContainer } from "./Components/ShipsToSection"
import { SoldBySectionFragmentContainer } from "./Components/SoldBySection"
import { SummarySectionFragmentContainer } from "./Components/SummarySection"
import { TrackOrderSectionFragmentContainer } from "./Components/TrackOrderSection"

const order = {
  requestedFulfillment: { __typename: "CommerceShip", name: "my name" },
  lineItems: { edges: [{ node: { artwork: { partner: { name: "partnerName" } } } }] },
}

describe(OrderDetailsQueryRender, () => {
  const TestRenderer = () => (
    <QueryRenderer<OrderDetailsTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query OrderDetailsTestsQuery @relay_test_operation {
          commerceOrder(id: "order-id") {
            ...OrderDetails_order
          }
        }
      `}
      variables={{ id: "order-id" }}
      render={({ props }) => {
        if (props?.commerceOrder) {
          return <OrderDetailsContainer order={props.commerceOrder} />
        }
      }}
    />
  )

  it("renders without throwing an error", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation({ CommerceOrder: () => order })
    expect(tree.findByType(SectionList)).toBeTruthy()
    expect(tree.findByType(OrderDetailsHeaderFragmentContainer)).toBeTruthy()
    expect(tree.findByType(ArtworkInfoSectionFragmentContainer)).toBeTruthy()
    expect(tree.findByType(SummarySectionFragmentContainer)).toBeTruthy()
    expect(tree.findByType(CreditCardSummaryItemFragmentContainer)).toBeTruthy()
    expect(tree.findByType(TrackOrderSectionFragmentContainer)).toBeTruthy()
    expect(tree.findByType(ShipsToSectionFragmentContainer)).toBeTruthy()
    expect(tree.findByType(SoldBySectionFragmentContainer)).toBeTruthy()
  })

  it("not render ShipsToSection when CommercePickup", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    order.requestedFulfillment.__typename = "CommercePickup"
    resolveMostRecentRelayOperation({ CommerceOrder: () => order })
    const sections: SectionListItem[] = tree.findByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "ShipTo_Section")).toHaveLength(0)
  })

  it("not render TrackOrderSection when CommercePickup", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    order.requestedFulfillment.__typename = "CommercePickup"
    resolveMostRecentRelayOperation({ CommerceOrder: () => order })
    const sections: SectionListItem[] = tree.findByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "TrackOrder_Section")).toHaveLength(0)
  })

  it("not render SoldBySection when partnerName null", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation({
      CommerceOrder: () => ({
        ...order,
        lineItems: { edges: [{ node: { artwork: { partner: null } } }] },
      }),
    })
    const sections: SectionListItem[] = tree.findByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "Sold_By")).toHaveLength(0)
  })

  it("renders without throwing an error", () => {
    renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation()
  })

  it("renders props for OrderDetails if feature flag is on", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      CommerceOrder: () => ({
        internalID: "222",
        requestedFulfillment: { __typename: "CommerceShip", name: "my name" },
      }),
    })
    expect(extractText(tree.root)).toContain("my name")
  })

  it("doesn't render MyCollections app if feature flag is not on", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation()
    expect(extractText(tree.root)).not.toContain("my name")
  })

  it("Loads OrderHistoryQueryRender with OrderDetailsPlaceholder", () => {
    const tree = renderWithWrappersLEGACY(
      <OrderDetailsQueryRender orderID="21856921-fa90-4a36-a17e-dd52870952d2" />
    ).root
    expect(tree.findAllByType(OrderDetailsPlaceholder)).toHaveLength(1)
  })
})
