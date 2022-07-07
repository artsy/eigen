import { OrderDetails_order$data } from "__generated__/OrderDetails_order.graphql"
import { OrderDetailsQuery } from "__generated__/OrderDetailsQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { compact } from "lodash"
import { Box, Flex, Separator, Text } from "palette"
import { SectionList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtworkInfoSectionFragmentContainer } from "./ArtworkInfoSection"
import { OrderDetailsHeaderFragmentContainer } from "./OrderDetailsHeader"
import { CreditCardSummaryItemFragmentContainer } from "./OrderDetailsPayment"
import { ShipsToSectionFragmentContainer } from "./ShipsToSection"
import { SoldBySectionFragmentContainer } from "./SoldBySection"
import { SummarySectionFragmentContainer } from "./SummarySection"
import { TrackOrderSectionFragmentContainer } from "./TrackOrderSection"

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
  const isShipping = fulfillmentType === "CommerceShipArta" || fulfillmentType === "CommerceShip"

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
    {
      key: "Summary_Section",
      title: "Order Summary",
      data: [<SummarySectionFragmentContainer key="Summary_SectionComponent" section={order} />],
    },
    {
      key: "Payment_Method",
      title: "Payment Method",
      data: [
        <CreditCardSummaryItemFragmentContainer key="Payment_MethodComponent" order={order} />,
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
    <PageWithSimpleHeader title="Order Details">
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
            marginTop={data.leadingItem && data.trailingSection ? 20 : 0}
            backgroundColor="black10"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          />
        )}
      />
    </PageWithSimpleHeader>
  )
}

export const OrderDetailsPlaceholder: React.FC<{}> = () => (
  <PageWithSimpleHeader title="Order Details">
    <Flex px={2}>
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
        <Separator mt={15} mb={2} />
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
        <Flex mt={2.2}>
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
  </PageWithSimpleHeader>
)

export const OrderDetailsContainer = createFragmentContainer(OrderDetails, {
  order: graphql`
    fragment OrderDetails_order on CommerceOrder {
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
    }
  `,
})

export const OrderDetailsQueryRender: React.FC<{ orderID: string }> = ({ orderID: orderID }) => {
  return (
    <QueryRenderer<OrderDetailsQuery>
      environment={defaultEnvironment}
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
