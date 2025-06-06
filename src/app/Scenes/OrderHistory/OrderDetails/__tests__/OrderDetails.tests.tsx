import { screen } from "@testing-library/react-native"
import { OrderDetailsTestsQuery } from "__generated__/OrderDetailsTestsQuery.graphql"
import { ArtworkInfoSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/ArtworkInfoSection"
import {
  OrderDetailsContainer,
  OrderDetailsPlaceholder,
  OrderDetailsQueryRender,
  SectionListItem,
} from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetails"
import { OrderDetailsHeaderFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsHeader"
import { PaymentMethodSummaryItemFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsPayment"
import { ShipsToSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/ShipsToSection"
import { SoldBySectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/SoldBySection"
import { SummarySectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/SummarySection"
import { TrackOrderSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/TrackOrderSection"
import { WirePaymentSectionFragmentContainer } from "app/Scenes/OrderHistory/OrderDetails/Components/WirePaymentSection"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { SectionList } from "react-native"
import { graphql } from "react-relay"

const order = {
  requestedFulfillment: { __typename: "CommerceShip", name: "my name" },
  lineItems: { edges: [{ node: { artwork: { partner: { name: "partnerName" } } } }] },
}

describe(OrderDetailsQueryRender, () => {
  const { renderWithRelay } = setupTestWrapper<OrderDetailsTestsQuery>({
    Component: ({ order }) => {
      if (!order) {
        return null
      }
      return <OrderDetailsContainer order={order} />
    },
    query: graphql`
      query OrderDetailsTestsQuery @relay_test_operation {
        order: commerceOrder(id: "order-id") {
          ...OrderDetails_order
        }
      }
    `,
  })

  it("renders without throwing an error", () => {
    renderWithRelay({ CommerceOrder: () => order })

    expect(screen.UNSAFE_getAllByType(SectionList)).toBeTruthy()
    expect(screen.UNSAFE_getByType(OrderDetailsHeaderFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_getByType(ArtworkInfoSectionFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_getByType(SummarySectionFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_getByType(PaymentMethodSummaryItemFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_getByType(TrackOrderSectionFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_getByType(ShipsToSectionFragmentContainer)).toBeTruthy()
    expect(screen.UNSAFE_getByType(SoldBySectionFragmentContainer)).toBeTruthy()
    expect(() => screen.UNSAFE_getAllByType(WirePaymentSectionFragmentContainer)).toThrow()
  })

  it("not render ShipsToSection when CommercePickup", () => {
    order.requestedFulfillment.__typename = "CommercePickup"

    renderWithRelay({ CommerceOrder: () => order })

    const sections: SectionListItem[] = screen.UNSAFE_getByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "ShipTo_Section")).toHaveLength(0)
  })

  it("not render TrackOrderSection when CommercePickup", () => {
    order.requestedFulfillment.__typename = "CommercePickup"

    renderWithRelay({ CommerceOrder: () => order })

    const sections: SectionListItem[] = screen.UNSAFE_getByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "TrackOrder_Section")).toHaveLength(0)
  })

  it("not render SoldBySection when partnerName null", () => {
    renderWithRelay({
      CommerceOrder: () => ({
        ...order,
        lineItems: { edges: [{ node: { artwork: { partner: null } } }] },
      }),
    })

    const sections: SectionListItem[] = screen.UNSAFE_getByType(SectionList).props.sections
    expect(sections.filter(({ key }) => key === "Sold_By")).toHaveLength(0)
  })

  it("renders without throwing an error", () => {
    renderWithRelay({ CommerceOrder: () => order })
  })

  it("renders props for OrderDetails if feature flag is on", () => {
    renderWithRelay({
      CommerceOrder: () => ({
        internalID: "222",
        requestedFulfillment: { __typename: "CommerceShip", name: "my name" },
      }),
    })
    expect(screen.getByText(/my name/)).toBeTruthy()
  })

  it("Loads OrderHistoryQueryRender with OrderDetailsPlaceholder", () => {
    const tree = renderWithWrappersLEGACY(
      <OrderDetailsQueryRender orderID="21856921-fa90-4a36-a17e-dd52870952d2" />
    ).root

    expect(tree.findAllByType(OrderDetailsPlaceholder)).toHaveLength(1)
  })

  it("renders WirePaymentSection when payment method is wire transfer and order in processing approval state", () => {
    renderWithRelay({
      CommerceOrder: () => ({
        ...order,
        code: "111111111",
        paymentMethod: "WIRE_TRANSFER",
        state: "PROCESSING_APPROVAL",
      }),
    })

    expect(screen.UNSAFE_getByType(WirePaymentSectionFragmentContainer)).toBeTruthy()
  })
})
