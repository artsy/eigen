import { OwnerType } from "@artsy/cohesion"
import {
  Box,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  useColor,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { OrderDetailQuery } from "__generated__/OrderDetailQuery.graphql"
import { OrderDetail_me$key } from "__generated__/OrderDetail_me.graphql"
import { OrderDetail_order$key } from "__generated__/OrderDetail_order.graphql"
import { OrderDetailBuyerProtection } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailBuyerProtection"
import { OrderDetailFulfillment } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailFulfillment"
import { OrderDetailHelpLinks } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailHelpLinks"
import { OrderDetailMessage } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailMessage"
import { OrderDetailMetadata } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailMetadata"
import { OrderDetailPaymentInfo } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailPaymentInfo"
import { OrderDetailPriceBreakdown } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailPriceBreakdown"
import { useOrderDetailTracking } from "app/Scenes/OrderHistory/OrderDetail/hooks/useOrderDetailTracking"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useEffect } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface OrderDetailProps {
  order: OrderDetail_order$key
  me: OrderDetail_me$key
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, me }) => {
  const space = useSpace()
  const color = useColor()
  const orderData = useFragment(orderDetailFragment, order)
  const meData = useFragment(meOrderDetailFragment, me)
  const orderDetailTracks = useOrderDetailTracking()

  useEffect(() => {
    if (!!orderData) {
      orderDetailTracks.orderDetailsViewed(orderData.internalID, orderData.displayTexts.messageType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <Box pb={2}>
          <Text variant="lg-display">{orderData.displayTexts.title}</Text>

          <Text variant="xs">Order #{orderData.code}</Text>
        </Box>

        {/* 2nd Part: Overview */}
        <OrderDetailMessage order={orderData} />

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
      <OrderDetailHelpLinks order={orderData} me={meData} />
    </Screen.ScrollView>
  )
}

const orderDetailFragment = graphql`
  fragment OrderDetail_order on Order {
    internalID
    code
    displayTexts {
      title
      messageType
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

const meOrderDetailFragment = graphql`
  fragment OrderDetail_me on Me {
    id
    ...OrderDetailHelpLinks_me
  }
`

const OrderDetailSkeleton: React.FC = () => {
  const { width: screenWidth } = useScreenDimensions()

  return (
    <Skeleton>
      <Box px={2} pt={2}>
        <SkeletonText variant="lg-display">Great Choice!</SkeletonText>

        <SkeletonText variant="xs">Order #1231231234</SkeletonText>

        <Box my={4}>
          <SkeletonText variant="sm" mb={2}>
            Thank you! Your order is being processed. You will receive an email shortly with all the
            details.
          </SkeletonText>

          <SkeletonText variant="sm" mb={2}>
            The gallery will confirm by MON 12, h:mm am CEST.
          </SkeletonText>

          <SkeletonText variant="sm">
            You can contact the gallery with any questions about your order.
          </SkeletonText>
        </Box>

        <SkeletonBox height={380} width={screenWidth - 40} />
      </Box>
    </Skeleton>
  )
}

export const OrderDetailQR: React.FC<{ orderID: string }> = withSuspense({
  Component: ({ orderID }) => {
    const data = useLazyLoadQuery<OrderDetailQuery>(
      orderDetailQRQuery,
      { orderID },
      { fetchPolicy: "store-and-network" }
    )

    if (!data.me?.order) {
      return null
    }

    return (
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({
          context_screen_owner_type: OwnerType.ordersDetail,
          context_screen_owner_id: data.me.order.internalID,
        })}
      >
        <OrderDetail order={data.me.order} me={data.me} />
      </ProvideScreenTrackingWithCohesionSchema>
    )
  },
  LoadingFallback: OrderDetailSkeleton,
  ErrorFallback: NoFallback,
})

const orderDetailQRQuery = graphql`
  query OrderDetailQuery($orderID: ID!) {
    me {
      ...OrderDetail_me
      order(id: $orderID) {
        internalID
        ...OrderDetail_order
      }
    }
  }
`
