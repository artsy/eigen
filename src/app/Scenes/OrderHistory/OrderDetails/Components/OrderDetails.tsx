import { Box, Flex, Separator, Text } from "@artsy/palette-mobile"
import { OrderDetailsQuery } from "__generated__/OrderDetailsQuery.graphql"
import { OrderDetails_order$data } from "__generated__/OrderDetails_order.graphql"
import { PendingOfferSection } from "app/Scenes/OrderHistory/OrderDetails/Components/PendingOfferSection"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { compact } from "lodash"
import { SectionList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtworkInfoSectionFragmentContainer } from "./ArtworkInfoSection"
import { OrderDetailsHeaderFragmentContainer } from "./OrderDetailsHeader"
import { PaymentMethodSummaryItemFragmentContainer } from "./OrderDetailsPayment"
import { ShipsToSectionFragmentContainer } from "./ShipsToSection"
import { SoldBySectionFragmentContainer } from "./SoldBySection"
import { SummarySectionFragmentContainer } from "./SummarySection"
import { TrackOrderSectionFragmentContainer } from "./TrackOrderSection"
import { WirePaymentSectionFragmentContainer } from "./WirePaymentSection"

export interface OrderDetailsProps {
  order: OrderDetails_order$data
}
export interface SectionListItem {
  key: string
  title?: string
  data: readonly JSX.Element[]
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const partnerName = extractNodes(order?.lineItems)?.[0]?.artwork?.partner
  const fulfillmentType = order.requestedFulfillment?.__typename
  const isProcessingWireTransfer =
    !!order.paymentMethod &&
    order.paymentMethod === "WIRE_TRANSFER" &&
    order.state === "PROCESSING_APPROVAL"
  const isShipping = fulfillmentType === "CommerceShipArta" || fulfillmentType === "CommerceShip"
  const isOfferPending = order.state === "SUBMITTED" && order.mode === "OFFER"

  const getShippingName = () => {
    if (
      order.requestedFulfillment?.__typename === "CommerceShipArta" ||
      order.requestedFulfillment?.__typename === "CommerceShip"
    ) {
      return order?.requestedFulfillment?.name
    }
    return null
  }

  const DATA: SectionListItem[] = compact([
    {
      key: "OrderDetailsHeader",
      data: [
        <OrderDetailsHeaderFragmentContainer key="OrderDetailsHeaderComponent" info={order} />,
      ],
    },
    {
      key: "Artwork_Info",
      title: "Artwork Info",
      data: [<ArtworkInfoSectionFragmentContainer key="Artwork_InfoComponent" artwork={order} />],
    },
    isOfferPending && {
      key: "OfferPending",
      data: [<PendingOfferSection key="PendingOfferComponent" order={order} />],
    },
    isProcessingWireTransfer && {
      key: "WirePayment",
      data: [<WirePaymentSectionFragmentContainer key="WirePaymentComponent" order={order} />],
    },
    {
      key: "Summary_Section",
      title: "Order Summary",
      data: [<SummarySectionFragmentContainer key="Summary_SectionComponent" section={order} />],
    },
    {
      key: "Payment_Method",
      title: "Payment Method",
      data: [
        <PaymentMethodSummaryItemFragmentContainer key="Payment_MethodComponent" order={order} />,
      ],
    },
    isShipping && {
      key: "TrackOrder_Section",
      title: "Track Order",
      data: [
        <TrackOrderSectionFragmentContainer key="TrackOrder_SectionComponent" section={order} />,
      ],
    },
    isShipping && {
      key: "ShipTo_Section",
      title: `Ships to ${getShippingName()}`,
      data: [<ShipsToSectionFragmentContainer key="ShipTo_SectionComponent" address={order} />],
    },
    !!partnerName && {
      key: "Sold By",
      title: `Sold by ${partnerName?.name}`,
      data: [<SoldBySectionFragmentContainer key="Sold ByComponent" soldBy={order} />],
    },
  ])

  return (
    <SectionList
      initialNumToRender={21}
      contentContainerStyle={{ paddingHorizontal: 20, marginTop: 20, paddingBottom: 47 }}
      sections={DATA}
      keyExtractor={(item, index) => item.key + index.toString()}
      renderItem={({ item }) => {
        return (
          <Flex flexDirection="column" justifyContent="space-between">
            <Box>{item}</Box>
          </Flex>
        )
      }}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section: { title, data } }) =>
        title && data ? (
          <Box>
            <Text mt={20} mb={10} variant="sm" weight="medium">
              {title}
            </Text>
          </Box>
        ) : null
      }
      SectionSeparatorComponent={(data) => (
        <Box
          height={!!data.leadingItem && !!data.trailingSection ? 2 : 0}
          mt={data.leadingItem && data.trailingSection ? 2 : 0}
          backgroundColor="mono10"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        />
      )}
    />
  )
}

export const OrderDetailsPlaceholder: React.FC<{}> = () => (
  <Flex px={2} testID="order-details-placeholder">
    <Flex flexDirection="row" mt={2}>
      <Flex mr={2}>
        <PlaceholderText width={80} marginTop={10} />
        <PlaceholderText width={100} marginTop={10} />
        <PlaceholderText width={50} marginTop={10} />
        <PlaceholderText width={70} marginTop={10} />
      </Flex>
      <Flex flexGrow={1}>
        <PlaceholderText width={90} marginTop={10} />
        <PlaceholderText width={60} marginTop={10} />
        <PlaceholderText width={65} marginTop={10} />
        <PlaceholderText width={60} marginTop={10} />
      </Flex>
    </Flex>
    <Flex flexDirection="column" justifyContent="center" alignItems="center" mt={1}>
      <Separator mt="15px" mb={2} />
    </Flex>
    <Flex>
      <PlaceholderText width={90} />
      <Flex flexDirection="row" mt={2}>
        <PlaceholderBox height={60} width={60} marginLeft={16} marginRight={22} />
        <Flex>
          <PlaceholderText width={50 + Math.random() * 100} />
          <PlaceholderText width={20 + Math.random() * 100} marginTop={10} />
          <PlaceholderText width={80 + Math.random() * 100} />
          <PlaceholderText width={30 + Math.random() * 100} />
          <PlaceholderText width={30 + Math.random() * 100} />
        </Flex>
      </Flex>
    </Flex>
    <Flex flexDirection="column" justifyContent="center" alignItems="center" mt={1}>
      <Separator mt={1} mb={2} />
    </Flex>
    <PlaceholderText width={100} />
    <Flex flexDirection="row" justifyContent="space-between">
      <Flex mt="2px">
        <PlaceholderText width={40} />
        <PlaceholderText width={60} marginTop={15} />
        <PlaceholderText width={30} />
        <PlaceholderText width={40} marginTop={15} />
      </Flex>
      <Flex alignItems="flex-end">
        <PlaceholderText width={50} />
        <PlaceholderText width={40} marginTop={15} />
        <PlaceholderText width={40} />
        <PlaceholderText width={50} marginTop={15} />
      </Flex>
    </Flex>
    <Flex flexDirection="column" justifyContent="center" alignItems="center" mt={1}>
      <Separator mt={1} mb={2} />
    </Flex>
  </Flex>
)

export const OrderDetailsContainer = createFragmentContainer(OrderDetails, {
  order: graphql`
    fragment OrderDetails_order on CommerceOrder {
      state
      paymentMethod
      mode

      requestedFulfillment {
        ... on CommerceShip {
          __typename
          name
        }
        ... on CommerceShipArta {
          __typename
          name
        }
        ... on CommercePickup {
          __typename
        }
      }

      lineItems(first: 1) {
        edges {
          node {
            artwork {
              partner {
                name
              }
            }
          }
        }
      }

      ...OrderDetailsHeader_info
      ...ArtworkInfoSection_artwork
      ...SummarySection_section
      ...OrderDetailsPayment_order
      ...TrackOrderSection_section
      ...ShipsToSection_address
      ...SoldBySection_soldBy
      ...WirePaymentSection_order
      ...PendingOfferSection_order
    }
  `,
})

export const OrderDetailsQueryRender: React.FC<{ orderID: string }> = ({ orderID: orderID }) => {
  return (
    <QueryRenderer<OrderDetailsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query OrderDetailsQuery($orderID: ID!) {
          order: commerceOrder(id: $orderID) @optionalField {
            ...OrderDetails_order
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: OrderDetailsContainer,
        renderPlaceholder: () => <OrderDetailsPlaceholder />,
      })}
      variables={{ orderID }}
      cacheConfig={{ force: true }}
    />
  )
}
