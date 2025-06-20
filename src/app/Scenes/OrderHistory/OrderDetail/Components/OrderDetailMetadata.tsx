import { Box, Flex, Image, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { OrderDetailMetadata_order$key } from "__generated__/OrderDetailMetadata_order.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { sizeToFit } from "app/utils/useSizeToFit"
import { graphql, useFragment } from "react-relay"

interface OrderDetailMetadataProps {
  order: OrderDetailMetadata_order$key
}

const IMAGE_MAX_HEIGHT = 380

export const OrderDetailMetadata: React.FC<OrderDetailMetadataProps> = ({ order }) => {
  const { width: screenWidth } = useScreenDimensions()

  const orderData = useFragment(fragment, order)
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  // const artwork = orderData.lineItems?.[0]?.artwork
  const artworkVersion = orderData.lineItems?.[0]?.artworkVersion
  const artworkImage = artworkVersion?.image

  const { height, width } = sizeToFit(
    { height: artworkImage?.height ?? 0, width: artworkImage?.width ?? 0 },
    { height: IMAGE_MAX_HEIGHT, width: screenWidth - 40 }
  )

  return (
    <Box>
      <Box py={1}>
        {/* Image */}
        {!!artworkImage?.url && (
          <Flex alignItems="center">
            <Image
              accessible
              accessibilityRole="image"
              accessibilityLabel={artworkVersion?.title || "Artwork image"}
              src={artworkImage.url}
              aspectRatio={artworkImage.aspectRatio ?? 1}
              width={width}
              height={height}
              blurhash={showBlurhash ? artworkImage.blurhash : undefined}
              geminiResizeMode="fit"
              resizeMode="contain"
            />
          </Flex>
        )}
      </Box>

      <Spacer y={1} />

      {/* Metadata */}
      <Text variant="sm">{artworkVersion?.artistNames}</Text>
      <Flex flexDirection="row" alignItems="center">
        <Text variant="sm" color="mono60" style={{ flex: 1 }} numberOfLines={1}>
          {artworkVersion?.title}
        </Text>
        <Text variant="sm" color="mono60">
          {artworkVersion?.date ? `, ${artworkVersion.date}` : ""}
        </Text>
      </Flex>
      {!!orderData.totalListPrice && (
        <Text variant="sm" color="mono60">
          List price: {orderData.totalListPrice.display}
        </Text>
      )}

      <Spacer y={1} />

      {!!artworkVersion?.attributionClass?.shortDescription && (
        <Text variant="sm" color="mono60">
          {artworkVersion.attributionClass.shortDescription}
        </Text>
      )}

      {!!artworkVersion?.dimensions && (
        <Text variant="sm" color="mono60">
          {artworkVersion.dimensions.in} | {artworkVersion.dimensions.cm}
        </Text>
      )}

      <Spacer y={1} />
    </Box>
  )
}

const fragment = graphql`
  fragment OrderDetailMetadata_order on Order {
    totalListPrice {
      display
    }
    itemsTotal {
      display
    }
    shippingTotal {
      display
    }
    taxTotal {
      display
    }
    lineItems {
      artworkVersion {
        title
        artistNames
        date
        attributionClass {
          shortDescription
        }
        dimensions {
          in
          cm
        }
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
