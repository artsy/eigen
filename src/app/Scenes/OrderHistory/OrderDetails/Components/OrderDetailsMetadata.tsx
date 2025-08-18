import { Box, Flex, Image, Spacer, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { OrderDetailsMetadata_order$key } from "__generated__/OrderDetailsMetadata_order.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { sizeToFit } from "app/utils/useSizeToFit"
import { Text as RNText } from "react-native"
import { graphql, useFragment } from "react-relay"

interface OrderDetailsMetadataProps {
  order: OrderDetailsMetadata_order$key
}

const IMAGE_MAX_HEIGHT = 380

export const OrderDetailsMetadata: React.FC<OrderDetailsMetadataProps> = ({ order }) => {
  const { width: screenWidth } = useScreenDimensions()
  const imageContainer = { height: IMAGE_MAX_HEIGHT, width: screenWidth - 40 }
  const orderData = useFragment(fragment, order)
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const artwork = orderData.lineItems?.[0]?.artwork
  const artworkVersion = orderData.lineItems?.[0]?.artworkVersion
  const artworkImage = artworkVersion?.image

  const artworkOrEditionSet = orderData.lineItems[0]?.artworkOrEditionSet
  const isArtworkOrEditionSet =
    !!artworkOrEditionSet &&
    (artworkOrEditionSet.__typename === "Artwork" ||
      artworkOrEditionSet?.__typename === "EditionSet")
  const dimensions = isArtworkOrEditionSet ? artworkOrEditionSet.dimensions : null
  const price = isArtworkOrEditionSet ? artworkOrEditionSet.price : null

  const { height, width } = sizeToFit(
    {
      height: artworkImage?.height ?? imageContainer.height,
      width: artworkImage?.width ?? imageContainer.width,
    },
    imageContainer
  )

  return (
    <Box pt={2}>
      <Box>
        {/* Image */}
        {!!artworkImage?.url && (
          <Flex alignItems="center" py={1}>
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
        {!!artworkVersion?.date && (
          <Text variant="sm" color="mono60">
            , {artworkVersion.date}
          </Text>
        )}
      </Flex>
      <Text variant="sm" color="mono60">
        {artwork?.partner?.name}
      </Text>
      {!!price && (
        <Text variant="sm" color="mono60">
          List price: {price}
        </Text>
      )}

      <Spacer y={1} />

      {!!artworkVersion?.attributionClass?.shortDescription && (
        <Text variant="sm" color="mono60">
          {artworkVersion.attributionClass.shortDescription}
        </Text>
      )}

      {!!dimensions && (
        <Text variant="sm" color="mono60">
          {dimensions.in} | {dimensions.cm}
        </Text>
      )}

      <Spacer y={1} />
    </Box>
  )
}

const fragment = graphql`
  fragment OrderDetailsMetadata_order on Order {
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
        image {
          blurhash
          url(version: ["larger", "large", "medium", "small", "square"])
          aspectRatio
          height
          width
        }
      }
      artworkOrEditionSet {
        __typename
        ... on Artwork {
          price
          dimensions {
            in
            cm
          }
        }
        ... on EditionSet {
          price
          dimensions {
            in
            cm
          }
        }
      }
    }
  }
`
