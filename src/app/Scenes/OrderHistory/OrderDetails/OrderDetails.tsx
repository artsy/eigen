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
import { OrderDetailsQuery } from "__generated__/OrderDetailsQuery.graphql"
import { OrderDetails_me$key } from "__generated__/OrderDetails_me.graphql"
import { OrderDetails_order$key } from "__generated__/OrderDetails_order.graphql"
import { OrderDetailsBuyerProtection } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsBuyerProtection"
import { OrderDetailsFulfillment } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsFulfillment"
import { OrderDetailsHelpLinks } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsHelpLinks"
import { OrderDetailsMessage } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsMessage"
import { OrderDetailsMetadata } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsMetadata"
import { OrderDetailsPaymentInfo } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsPaymentInfo"
import { OrderDetailsPriceBreakdown } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetailsPriceBreakdown"
import { useOrderDetailsTracking } from "app/Scenes/OrderHistory/OrderDetails/hooks/useOrderDetailsTracking"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useEffect } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface OrderDetailProps {
  order: OrderDetails_order$key
  me: OrderDetails_me$key
}

export const OrderDetails: React.FC<OrderDetailProps> = ({ order, me }) => {
  const space = useSpace()
  const color = useColor()
  const orderData = useFragment(orderDetailsFragment, order)
  const meData = useFragment(meOrderDetailsFragment, me)
  const orderDetailTracks = useOrderDetailsTracking()

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
        <OrderDetailsMessage order={orderData} />

        {/* 3rd Part: Artwork image and metadata */}
        <OrderDetailsMetadata order={orderData} />

        {/* 4th Part: Artwork price breakdown */}
        <OrderDetailsPriceBreakdown order={orderData} />

        <Spacer y={2} />

        {/* 5th Part: Artsy Buyer Protection */}
        <OrderDetailsBuyerProtection order={orderData} />
      </Box>

      <Spacer y={2} />
      <Box backgroundColor="mono5" height={10} />
      <Spacer y={2} />

      {/* 6th Part: Shipping */}
      <OrderDetailsFulfillment order={orderData} />

      <Spacer y={2} />
      <Box backgroundColor="mono5" height={10} />
      <Spacer y={2} />

      {/* 7th Part: Payment */}
      <OrderDetailsPaymentInfo order={orderData} />

      <Spacer y={2} />

      {/* 8th Part: Help links */}
      <OrderDetailsHelpLinks order={orderData} me={meData} />
    </Screen.ScrollView>
  )
}

const orderDetailsFragment = graphql`
  fragment OrderDetails_order on Order {
    internalID
    code
    displayTexts {
      title
      messageType
    }
    ...OrderDetailsBuyerProtection_order
    ...OrderDetailsFulfillment_order
    ...OrderDetailsHelpLinks_order
    ...OrderDetailsMessage_order
    ...OrderDetailsMetadata_order
    ...OrderDetailsPaymentInfo_order
    ...OrderDetailsPriceBreakdown_order
  }
`

const meOrderDetailsFragment = graphql`
  fragment OrderDetails_me on Me {
    id
    ...OrderDetailsHelpLinks_me
  }
`

const OrderDetailsSkeleton: React.FC = () => {
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

export const OrderDetailsQR: React.FC<{ orderID: string }> = withSuspense({
  Component: ({ orderID }) => {
    const data = useLazyLoadQuery<OrderDetailsQuery>(
      orderDetailsQRQuery,
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
        <OrderDetails order={data.me.order} me={data.me} />
      </ProvideScreenTrackingWithCohesionSchema>
    )
  },
  LoadingFallback: OrderDetailsSkeleton,
  ErrorFallback: NoFallback,
})

const orderDetailsQRQuery = graphql`
  query OrderDetailsQuery($orderID: ID!) {
    me {
      ...OrderDetails_me
      order(id: $orderID) {
        internalID
        ...OrderDetails_order
      }
    }
  }
`
