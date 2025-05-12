import { ShieldIcon, VisaIcon } from "@artsy/icons/native"
import {
  Box,
  Flex,
  Image,
  LinkText,
  Message,
  Screen,
  Spacer,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { OrderDetailQuery } from "__generated__/OrderDetailQuery.graphql"
import { OrderDetail_order$key } from "__generated__/OrderDetail_order.graphql"
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
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const data = useFragment(orderDetailFragment, order)

  if (!data) {
    return null
  }

  const orderArtwork = data.lineItems?.[0]?.artwork

  const { height, width } = sizeToFit(
    { height: orderArtwork?.image?.height ?? 0, width: orderArtwork?.image?.width ?? 0 },
    { height: IMAGE_MAX_HEIGHT, width: screenWidth - 40 }
  )

  return (
    <Screen.ScrollView contentContainerStyle={{ paddingVertical: space(2) }}>
      <Box px={2}>
        {/* 1st Part: Greetings */}
        <Box>
          <Text variant="lg-display">Great Choice, Vivianna!</Text>

          <Text variant="xs">Order #123456789</Text>
        </Box>

        <Spacer y={4} />

        {/* 2nd Part: Overview */}
        <Box>
          <Text variant="sm">
            Thank you! Your order is being processed. You will receive an email shortly with all the
            details.
            {"\n"}
          </Text>

          <Text variant="sm">
            The gallery will confirm by <Text fontWeight="bold">Feb 21, 2:46 PM EDT.</Text>
            {"\n"}
          </Text>

          <Text variant="sm">
            You can <LinkText>contact the gallery</LinkText> with any questions about your order.
          </Text>
        </Box>

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
      <Box px={2}>
        <Text variant="sm" fontWeight="bold">
          Ship to
        </Text>

        <Spacer y={0.5} />

        <Box>
          <Text variant="xs">Viviana Flores</Text>
          <Text variant="xs">401 Broadway</Text>
          <Text variant="xs">New York, NY 10013</Text>
          <Text variant="xs">United States</Text>
          <Text variant="xs">(212) 456-7890</Text>
        </Box>
      </Box>

      <Spacer y={2} />
      <Box backgroundColor="mono5" height={10} />
      <Spacer y={2} />

      {/* 7th Part: Payment */}
      <Box px={2}>
        <Text variant="sm" fontWeight="bold">
          Payment method
        </Text>

        <Spacer y={0.5} />

        <Flex flexDirection="row" alignItems="center">
          <VisaIcon mr={0.5} />

          <Text variant="xs"> •••• 4242 </Text>
          <Text variant="xs"> Exp 12/29 </Text>
        </Flex>
      </Box>
    </Screen.ScrollView>
  )
}

const orderDetailFragment = graphql`
  fragment OrderDetail_order on Order {
    id
    internalID

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
  query OrderDetailQuery($orderID: String!) {
    me {
      order(id: $orderID) {
        ...OrderDetail_order
      }
    }
  }
`
