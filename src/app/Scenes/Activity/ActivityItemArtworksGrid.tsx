import { Box, Flex, FlexProps, Image, SkeletonBox, Spacer, Touchable } from "@artsy/palette-mobile"
import { ActivityItemArtworksGrid_notification$key } from "__generated__/ActivityItemArtworksGrid_notification.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { FC } from "react"
import { useWindowDimensions } from "react-native"
import { graphql, useFragment } from "react-relay"

const TOTAL_HORIZONTAL_PADDING = 40
const IMAGE_OFFSET = 10

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
  const rowImageWidth = (width - (TOTAL_HORIZONTAL_PADDING + IMAGE_OFFSET)) / 2

  return (
    <>
      <Box>
        <Flex flexDirection="row">
          <ArtworkImage
            imageURL={imageURLs[0]}
            size={rowImageWidth}
            artworkHref={artworkNodes[0].href!}
          />
          <Spacer x={`${IMAGE_OFFSET}px`} />

          {artworkNodes.length > 1 && (
            <ArtworkImage
              imageURL={imageURLs[1]}
              size={rowImageWidth}
              artworkHref={artworkNodes[1].href!}
            />
          )}
        </Flex>

        {artworkNodes.length > 2 && (
          <>
            <Spacer y={`${IMAGE_OFFSET}px`} />

            <Flex flexDirection="row">
              <ArtworkImage
                imageURL={imageURLs[2]}
                size={rowImageWidth}
                artworkHref={artworkNodes[2].href!}
              />
              <Spacer x={`${IMAGE_OFFSET}px`} />

              {artworkNodes.length > 3 && (
                <ArtworkImage
                  imageURL={imageURLs[3]}
                  size={rowImageWidth}
                  artworkHref={artworkNodes[3].href!}
                />
              )}
            </Flex>
          </>
        )}
      </Box>

      <Spacer y={2} />
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
  const rowImageWidth = (width - (TOTAL_HORIZONTAL_PADDING + IMAGE_OFFSET)) / 2

  return (
    <>
      <Box>
        <Flex flexDirection="row">
          <SkeletonBox width={rowImageWidth} height={rowImageWidth} />
          <Spacer x={`${IMAGE_OFFSET}px`} />

          <SkeletonBox width={rowImageWidth} height={rowImageWidth} />
        </Flex>

        <>
          <Spacer y={`${IMAGE_OFFSET}px`} />

          <Flex flexDirection="row">
            <SkeletonBox width={rowImageWidth} height={rowImageWidth} />
            <Spacer x={`${IMAGE_OFFSET}px`} />

            <SkeletonBox width={rowImageWidth} height={rowImageWidth} />
          </Flex>
        </>
      </Box>

      <Spacer y={2} />
    </>
  )
}
