import { Box, Flex, FlexProps, Image, SkeletonBox, Spacer, Touchable } from "@artsy/palette-mobile"
import { ActivityItemArtworksGrid_notification$key } from "__generated__/ActivityItemArtworksGrid_notification.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { FC } from "react"
import { useWindowDimensions } from "react-native"
import { graphql, useFragment } from "react-relay"

const TOTAL_HORIZONTAL_PADDING = 40
const IMAGES_PER_ROW = 2
const GAP_BETWEEN_IMAGES = 1

interface ActivityItemArtworksGridProps {
  notification: ActivityItemArtworksGrid_notification$key
}

export const ActivityItemArtworksGrid: FC<ActivityItemArtworksGridProps> = ({ notification }) => {
  const { width } = useWindowDimensions()

  const data = useFragment<ActivityItemArtworksGrid_notification$key>(
    activityItemArtworksGridFragment,
    notification
  )
  const artworkNodes = extractNodes(data.artworksConnection)

  if (artworkNodes.length === 0) {
    return null
  }

  const imageURLs = compact(artworkNodes.map((node) => node.image?.resized?.url ?? null))
  const rowImageWidth = (width - TOTAL_HORIZONTAL_PADDING - 10) / IMAGES_PER_ROW

  return (
    <>
      <Flex flex={1} flexDirection="row" flexWrap="wrap">
        {imageURLs.map((imageURL, index) => {
          return (
            <Box
              key={`artwork-image-${index}`}
              mr={index % 2 == 0 ? GAP_BETWEEN_IMAGES : 0}
              mb={GAP_BETWEEN_IMAGES}
            >
              <ArtworkImage
                imageURL={imageURL}
                size={rowImageWidth}
                artworkHref={artworkNodes[index].href!}
              />
            </Box>
          )
        })}
      </Flex>

      <Spacer y={1} />
    </>
  )
}

const activityItemArtworksGridFragment = graphql`
  fragment ActivityItemArtworksGrid_notification on Notification {
    artworksConnection(first: 4) {
      edges {
        node {
          href
          image {
            resized(height: 300, width: 300, version: "normalized") {
              url
            }
          }
        }
      }
    }
  }
`
interface ArtworkImageProps extends FlexProps {
  artworkHref: string
  imageURL: string
  size: number
}

const ArtworkImage: FC<ArtworkImageProps> = ({ imageURL, size, artworkHref, ...rest }) => {
  return (
    <Touchable onPress={() => navigate(artworkHref!)}>
      <Flex {...rest}>
        <Image src={imageURL!} width={size} height={size} />
      </Flex>
    </Touchable>
  )
}

export const ActivityItemArtworksGridPlaceholder: FC = () => {
  const { width } = useWindowDimensions()
  const rowImageWidth = (width - TOTAL_HORIZONTAL_PADDING - 10) / IMAGES_PER_ROW

  return (
    <>
      <Flex flex={1} flexDirection="row" flexWrap="wrap">
        {Array.from(Array(4)).map((_, index) => {
          return (
            <SkeletonBox
              key={`artwork-image-placeholder-${index}`}
              mr={index % 2 == 0 ? GAP_BETWEEN_IMAGES : 0}
              mb={GAP_BETWEEN_IMAGES}
              width={rowImageWidth}
              height={rowImageWidth}
            />
          )
        })}
      </Flex>

      <Spacer y={1} />
    </>
  )
}
