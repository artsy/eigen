import { Box, Screen, Spacer, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { OrderDetailQuery } from "__generated__/OrderDetailQuery.graphql"
import { OrderDetail_order$key } from "__generated__/OrderDetail_order.graphql"
import { OrderDetailBuyerProtection } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailBuyerProtection"
import { OrderDetailFulfillment } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailFulfillment"
import { OrderDetailHelpLinks } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailHelpLinks"
import { OrderDetailMessage } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailMessage"
import { OrderDetailMetadata } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailMetadata"
import { OrderDetailPaymentInfo } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailPaymentInfo"
import { OrderDetailPriceBreakdown } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailPriceBreakdown"
import { NoFallback, SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface OrderDetailProps {
  order: OrderDetail_order$key
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const space = useSpace()
  const color = useColor()
  const orderData = useFragment(orderDetailFragment, order)

  if (!orderData) {
    return null
  }

  return (
    <Screen.ScrollView
      style={{ backgroundColor: color("mono5") }}
      contentContainerStyle={{ paddingTop: space(2), backgroundColor: color("mono0") }}
    >
      <Box px={2}>
        {/* 1st Part: Greetings */}
        <Box>
          <Text variant="lg-display">{orderData.displayTexts.title}</Text>

          <Text variant="xs">Order #{orderData.code}</Text>
        </Box>

        <Spacer y={4} />

        {/* 2nd Part: Overview */}
        <OrderDetailMessage order={orderData} />

        <Spacer y={4} />

        {/* 3rd Part: Artwork image and metadata */}
        <OrderDetailMetadata order={orderData} />

        {/* 4th Part: Artwork price breakdown */}
        <OrderDetailPriceBreakdown order={orderData} />

        <Spacer y={2} />

        {/* 5th Part: Artsy Buyer Protection */}
        <OrderDetailBuyerProtection order={orderData} />
      </Box>

      <Spacer y={2} />
      <Box backgroundColor="mono5" height={10} />
      <Spacer y={2} />

      {/* 6th Part: Shipping */}
      <OrderDetailFulfillment order={orderData} />

      <Spacer y={2} />
      <Box backgroundColor="mono5" height={10} />
      <Spacer y={2} />

      {/* 7th Part: Payment */}
      <OrderDetailPaymentInfo order={orderData} />

      <Spacer y={2} />

      {/* 8th Part: Help links */}
      <OrderDetailHelpLinks order={orderData} />
    </Screen.ScrollView>
  )
}

const orderDetailFragment = graphql`
  fragment OrderDetail_order on Order {
    internalID
    code
    displayTexts {
      title
    }
    ...OrderDetailBuyerProtection_order
    ...OrderDetailFulfillment_order
    ...OrderDetailHelpLinks_order
    ...OrderDetailMessage_order
    ...OrderDetailMetadata_order
    ...OrderDetailPaymentInfo_order
    ...OrderDetailPriceBreakdown_order
  }
`

export const OrderDetailQR: React.FC<{ orderID: string }> = withSuspense({
  Component: ({ orderID }) => {
    const data = useLazyLoadQuery<OrderDetailQuery>(orderDetailQRQuery, { orderID })

    if (!data.me?.order) {
      return null
    }

    return <OrderDetail order={data.me.order} />
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: NoFallback,
})

const orderDetailQRQuery = graphql`
  query OrderDetailQuery($orderID: ID!) {
    me {
      order(id: $orderID) {
        ...OrderDetail_order
      }
    }
  }
`
