import { ShieldIcon } from "@artsy/icons/native"
import {
  Box,
  Flex,
  Image,
  LinkText,
  Message,
  Screen,
  Spacer,
  Text,
  useColor,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { OrderDetailQuery } from "__generated__/OrderDetailQuery.graphql"
import { OrderDetail_order$key } from "__generated__/OrderDetail_order.graphql"
import { OrderDetailFulfillment } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailFulfillment"
import { OrderDetailHelpLinks } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailHelpLinks"
import { OrderDetailMessage } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailMessage"
import { OrderDetailPaymentInfo } from "app/Scenes/OrderHistory/OrderDetail/Components/OrderDetailPaymentInfo"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { sizeToFit } from "app/utils/useSizeToFit"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface OrderDetailProps {
  order: OrderDetail_order$key
}

const IMAGE_MAX_HEIGHT = 380

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  const color = useColor()
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const orderData = useFragment(orderDetailFragment, order)

  if (!orderData) {
    return null
  }

  const orderArtwork = orderData.lineItems?.[0]?.artwork

  const { height, width } = sizeToFit(
    { height: orderArtwork?.image?.height ?? 0, width: orderArtwork?.image?.width ?? 0 },
    { height: IMAGE_MAX_HEIGHT, width: screenWidth - 40 }
  )

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
        <Box>
          <Box backgroundColor="mono5" py={1}>
            {/* Image */}
            {!!orderArtwork?.image?.url && (
              <Flex alignItems="center">
                <Image
                  src={orderArtwork.image.url}
                  aspectRatio={orderArtwork.image.aspectRatio ?? 1}
                  width={width}
                  height={height}
                  blurhash={showBlurhash ? orderArtwork.image.blurhash : undefined}
                  geminiResizeMode="fit"
                  resizeMode="contain"
                />
              </Flex>
            )}
          </Box>

          <Spacer y={1} />

          {/* Metadata */}
          <Text variant="sm">Marina Savashynskaya Dunbar</Text>
          <Text variant="sm" color="mono60">
            Wayfinding, 2023
          </Text>
          <Text variant="sm" color="mono60">
            List price: $15,000
          </Text>
          <Spacer y={1} />
          <Text variant="sm" color="mono60">
            Part of a limited edition set
          </Text>
          <Text variant="sm" color="mono60">
            9 2/5 x 11 4/5 in | 24 x 30 cm
          </Text>
          <Spacer y={1} />
        </Box>

        {/* 4th Part: Artwork price breakdown */}
        <Box my={1}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Text variant="sm" color="mono60">
              Price
            </Text>
            <Text variant="sm" color="mono60">
              $15,000
            </Text>
          </Flex>

          <Flex flexDirection="row" justifyContent="space-between">
            <Text variant="sm" color="mono60">
              Standard shipping
            </Text>
            <Text variant="sm" color="mono60">
              $0
            </Text>
          </Flex>

          <Flex flexDirection="row" justifyContent="space-between">
            <Text variant="sm" color="mono60">
              Tax*
            </Text>
            <Text variant="sm" color="mono60">
              $100
            </Text>
          </Flex>

          <Spacer y={0.5} />

          <Flex flexDirection="row" justifyContent="space-between">
            <Text variant="sm" fontWeight="bold">
              Total
            </Text>
            <Text variant="sm" fontWeight="bold">
              $15,100
            </Text>
          </Flex>

          <Spacer y={2} />
          <Text variant="xs" color="mono60">
            *Additional duties and taxes{" "}
            <LinkText variant="xs" color="mono60">
              may apply at import
            </LinkText>
            .
          </Text>
        </Box>

        <Spacer y={2} />

        {/* 5th Part: Artsy Buyer Protection */}
        <Message variant="default" containerStyle={{ px: 1 }}>
          <Flex flexDirection="row" alignItems="flex-start">
            <ShieldIcon fill="mono100" mr={0.5} mt="2px" />

            <Flex flex={1}>
              <Text variant="xs">
                Your purchase is protected with{" "}
                <LinkText variant="xs">Artsy’s buyer protection</LinkText>.
              </Text>
            </Flex>
          </Flex>
        </Message>
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
      <OrderDetailHelpLinks />
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
    ...OrderDetailMessage_order
    ...OrderDetailPaymentInfo_order
    ...OrderDetailFulfillment_order

    lineItems {
      artwork {
        image {
          blurhash
          url(version: ["larger", "large", "medium", "small", "square"])
          aspectRatio
          height
          width
        }
      }
    }
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
