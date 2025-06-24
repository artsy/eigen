import { Box, Flex, Image, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { OrderDetailMetadata_order$key } from "__generated__/OrderDetailMetadata_order.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { sizeToFit } from "app/utils/useSizeToFit"
import { Text as RNText } from "react-native"
import { graphql, useFragment } from "react-relay"

interface OrderDetailMetadataProps {
  order: OrderDetailMetadata_order$key
}

const IMAGE_MAX_HEIGHT = 380

export const OrderDetailMetadata: React.FC<OrderDetailMetadataProps> = ({ order }) => {
  const { width: screenWidth } = useScreenDimensions()
  const imageContainer = { height: IMAGE_MAX_HEIGHT, width: screenWidth - 40 }
  const orderData = useFragment(fragment, order)
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const artwork = orderData.lineItems?.[0]?.artwork
  const artworkVersion = orderData.lineItems?.[0]?.artworkVersion
  const artworkImage = artworkVersion?.image

  const { height, width } = sizeToFit(
    {
      height: artworkImage?.height ?? imageContainer.height,
      width: artworkImage?.width ?? imageContainer.width,
    },
    imageContainer
  )

  return (
    <Box>
      <Box py={1}>
        {/* Image */}
        {!!artworkImage?.url && (
          <Flex alignItems="center">
            {!!artwork?.slug && artwork.published ? (
              <RouterLink to={`/artwork/${artwork.slug}`}>
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
              </RouterLink>
            ) : (
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
            )}
          </Flex>
        )}
      </Box>

      <Spacer y={1} />

      {/* Metadata */}
      <RNText numberOfLines={1}>
        <Text variant="sm">{artworkVersion?.artistNames}</Text>
      </RNText>
      <Flex flexDirection="row" alignItems="center">
        <RNText numberOfLines={1} style={{ flexShrink: 1 }}>
          <Text variant="sm" color="mono60">
            {artworkVersion?.title}
          </Text>
        </RNText>
        <Text variant="sm" color="mono60">
          {artworkVersion?.date ? `, ${artworkVersion.date}` : ""}
        </Text>
      </Flex>
      <Text variant="sm" color="mono60">
        {artwork?.partner?.name}
      </Text>
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
    lineItems {
      artwork {
        partner {
          name
        }
        slug
        published
      }
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
