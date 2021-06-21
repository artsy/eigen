import { OrderDetails_order } from "__generated__/OrderDetails_order.graphql"
import { OrderDetailsQuery } from "__generated__/OrderDetailsQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Separator, Text } from "palette"
import React from "react"
import { SectionList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtworkInfoSectionFragmentContainer } from "./ArtworkInfoSection"
import { OrderDetailsHeader } from "./OrderDetailsHeader"
import { CreditCardSummaryItemFragmentContainer } from "./OrderDetailsPayment"
import { ShipsToSectionFragmentContainer } from "./ShipsToSection"
import { SoldBySectionFragmentContainer } from "./SoldBySection"
import { SummarySectionFragmentContainer } from "./SummarySection"

export interface OrderDetailsProps {
  order: OrderDetails_order
}
interface SectionListItem {
  key: string
  title?: string
  data: readonly JSX.Element[]
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const partnerName = extractNodes(order.lineItems)[0].artwork?.partner
  const shippingName =
    order?.requestedFulfillment?.__typename === "CommerceShip" ? order?.requestedFulfillment.name : null
  const DATA: SectionListItem[] = [
    {
      key: "OrderDetailsHeader",
      data: [<OrderDetailsHeader info={order} />],
    },
    {
      key: "Artwork_Info",
      title: "Artwork Info",
      data: [<ArtworkInfoSectionFragmentContainer artwork={order} />],
    },
    {
      key: "Summary_Section",
      title: "Order Summary",
      data: [<SummarySectionFragmentContainer section={order} />],
    },
    {
      key: "Payment_Method",
      title: "Payment Method",
      data: [<CreditCardSummaryItemFragmentContainer order={order} />],
    },
    {
      key: "ShipTo_Section",
      title: `Ships to ${shippingName}`,
      data: [<ShipsToSectionFragmentContainer address={order} />],
    },
    {
      key: "Sold By",
      title: `Sold by ${partnerName?.name}`,
      data: [<SoldBySectionFragmentContainer testID="ShipsToSection" soldBy={order} />],
    },
  ]
  if (order.requestedFulfillment?.__typename === "CommercePickup") {
    DATA.splice(4, 1)
  }
  return (
    <PageWithSimpleHeader title="Order Details">
      <SectionList
        initialNumToRender={15}
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
              <Text mt={20} mb={10} variant="mediumText">
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
          ></Box>
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
          <PlaceholderText width={80} />
          <PlaceholderText width={100} marginTop={10} />
          <PlaceholderText width={50} marginTop={10} />
        </Flex>
        <Flex flexGrow={1}>
          <PlaceholderText width={90} />
          <PlaceholderText width={60} marginTop={10} />
          <PlaceholderText width={65} marginTop={10} />
        </Flex>
      </Flex>
      <Flex flexDirection="column" justifyContent="center" alignItems="center" mt={1}>
        <Separator mt={1} mb={2} />
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
      ...OrderDetailsHeader_info @relay(mask: false)
      ...ArtworkInfoSection_artwork
      ...SummarySection_section
      ...OrderDetailsPayment_order
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
          order: commerceOrder(id: $orderID) {
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
