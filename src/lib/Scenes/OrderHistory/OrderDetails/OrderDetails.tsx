import { OrderDetails_order } from "__generated__/OrderDetails_order.graphql"
import { OrderDetailsQuery } from "__generated__/OrderDetailsQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Separator } from "palette"
import React from "react"
import { Text } from "react-native"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

export interface OrderDetailsProps {
  order: OrderDetails_order
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <PageWithSimpleHeader title="Order Details">
      <ScrollView>
        <Text>{order.internalID}</Text>
      </ScrollView>
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
      internalID
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
