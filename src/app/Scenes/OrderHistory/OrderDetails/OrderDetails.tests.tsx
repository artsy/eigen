import { OrderDetailsTestsQuery } from "__generated__/OrderDetailsTestsQuery.graphql"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { SectionList } from "react-native"
import { graphql } from "react-relay"
import { ArtworkInfoSectionFragmentContainer } from "./Components/ArtworkInfoSection"
import {
  OrderDetailsContainer,
  OrderDetailsPlaceholder,
  OrderDetailsQueryRender,
  SectionListItem,
} from "./Components/OrderDetails"
import { OrderDetailsHeaderFragmentContainer } from "./Components/OrderDetailsHeader"
import { PaymentMethodSummaryItemFragmentContainer } from "./Components/OrderDetailsPayment"
import { ShipsToSectionFragmentContainer } from "./Components/ShipsToSection"
import { SoldBySectionFragmentContainer } from "./Components/SoldBySection"
import { SummarySectionFragmentContainer } from "./Components/SummarySection"
import { TrackOrderSectionFragmentContainer } from "./Components/TrackOrderSection"
import { WirePaymentSectionFragmentContainer } from "./Components/WirePaymentSection"

const order = {
  requestedFulfillment: { __typename: "CommerceShip", name: "my name" },
  lineItems: { edges: [{ node: { artwork: { partner: { name: "partnerName" } } } }] },
}

describe(OrderDetailsQueryRender, () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailsTestsQuery>({
    Component: (props) => {
      if (props?.commerceOrder) {
        return <OrderDetailsContainer order={props.commerceOrder} />
      }
      return null
    },
    query: graphql`
      query OrderDetailsTestsQuery @relay_test_operation {
        commerceOrder(id: "order-id") {
          ...OrderDetails_order
        }
      }
    `,
  })

  it("renders correct components", () => {
    const tree = renderWithRelay({ CommerceOrder: () => order })
    expect(tree.UNSAFE_getByType(SectionList)).toBeTruthy()
    expect(tree.UNSAFE_getByType(OrderDetailsHeaderFragmentContainer)).toBeTruthy()
    expect(tree.UNSAFE_getByType(ArtworkInfoSectionFragmentContainer)).toBeTruthy()
    expect(tree.UNSAFE_getByType(SummarySectionFragmentContainer)).toBeTruthy()
    expect(tree.UNSAFE_getByType(PaymentMethodSummaryItemFragmentContainer)).toBeTruthy()
    expect(tree.UNSAFE_getByType(TrackOrderSectionFragmentContainer)).toBeTruthy()
    expect(tree.UNSAFE_getByType(ShipsToSectionFragmentContainer)).toBeTruthy()
    expect(tree.UNSAFE_getByType(SoldBySectionFragmentContainer)).toBeTruthy()
    expect(tree.UNSAFE_getAllByType(WirePaymentSectionFragmentContainer)).toHaveLength(0)
  })

  it("not render ShipsToSection when CommercePickup", () => {
    const tree = renderWithRelay({ CommerceOrder: () => order })
    const sections: SectionListItem[] = tree.UNSAFE_getByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "ShipTo_Section")).toHaveLength(0)
  })

  it("not render TrackOrderSection when CommercePickup", () => {
    const tree = renderWithRelay({ CommerceOrder: () => order })
    const sections: SectionListItem[] = tree.UNSAFE_getByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "TrackOrder_Section")).toHaveLength(0)
  })

  it("not render SoldBySection when partnerName null", () => {
    const tree = renderWithRelay({
      CommerceOrder: () => ({
        ...order,
        lineItems: { edges: [{ node: { artwork: { partner: null } } }] },
      }),
    })
    const sections: SectionListItem[] = tree.UNSAFE_getByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "Sold_By")).toHaveLength(0)
  })

  it("renders props for OrderDetails if feature flag is on", () => {
    const tree = renderWithRelay({
      CommerceOrder: () => ({
        internalID: "222",
        requestedFulfillment: { __typename: "CommerceShip", name: "my name" },
      }),
    })
    expect(tree.getByText("my name")).toBeTruthy()
  })

  it("doesn't render MyCollections app if feature flag is not on", () => {
    const tree = renderWithRelay()
    expect(tree.getByText("my name")).toBeFalsy()
  })

  it("Loads OrderHistoryQueryRender with OrderDetailsPlaceholder", () => {
    const tree = renderWithWrappersLEGACY(
      <OrderDetailsQueryRender orderID="21856921-fa90-4a36-a17e-dd52870952d2" />
    ).root
    expect(tree.findAllByType(OrderDetailsPlaceholder)).toHaveLength(1)
  })

  it("renders WirePaymentSection when payment method is wire transfer and order in processing approval state", () => {
    const tree = renderWithRelay({
      CommerceOrder: () => ({
        ...order,
        code: "111111111",
        paymentMethod: "WIRE_TRANSFER",
        state: "PROCESSING_APPROVAL",
      }),
    })

    expect(tree.UNSAFE_getByType(WirePaymentSectionFragmentContainer)).toBeTruthy()
  })
})
