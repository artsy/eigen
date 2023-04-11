import { tappedCollectedArtwork } from "@artsy/cohesion"
import { NoArtworkIcon, Flex, Text } from "@artsy/palette-mobile"
import {
  MyCollectionArtworkListItem_artwork$data,
  MyCollectionArtworkListItem_artwork$key,
} from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import HighDemandIcon from "app/Components/Icons/HighDemandIcon"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { navigate } from "app/system/navigation/navigate"
import { useLocalImage } from "app/utils/LocalImageStore"
import { getImageSquareDimensions } from "app/utils/resizeImage"
import { Touchable } from "@artsy/palette-mobile"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

export const ARTWORK_LIST_IMAGE_SIZE = 80

const ListItemImageView: React.FC<{
  image?: MyCollectionArtworkListItem_artwork$data["image"] | null
}> = ({ image }) => {
  const localImage = useLocalImage(image, "small")
  // The order of image is important as local images are used before Gemini processed images are ready
  if (image?.url) {
    const imageDimensions = getImageSquareDimensions(
      localImage?.height || image?.height,
      localImage?.width || image?.width,
      ARTWORK_LIST_IMAGE_SIZE
    )

    return (
      <Flex
        width={ARTWORK_LIST_IMAGE_SIZE}
        height={ARTWORK_LIST_IMAGE_SIZE}
        borderRadius={2}
        alignItems="center"
        justifyContent="center"
        // To align the image with the text we have to add top margin to compensate the line height.
        style={{ marginTop: 3 }}
      >
        <OpaqueImageView
          imageURL={localImage?.path || image.url}
          width={imageDimensions.width}
          height={imageDimensions.height}
          aspectRatio={image.aspectRatio}
          useRawURL={!!localImage}
        />
      </Flex>
    )
  }

  return (
    <Flex
      testID="no-artwork-icon"
      width={ARTWORK_LIST_IMAGE_SIZE}
      height={ARTWORK_LIST_IMAGE_SIZE}
      borderRadius={2}
      alignItems="center"
      justifyContent="center"
    >
      <NoArtworkIcon width={20} height={20} opacity={0.3} />
    </Flex>
  )
}

export const MyCollectionArtworkListItem: React.FC<{
  artwork: MyCollectionArtworkListItem_artwork$key
}> = ({ ...restProps }) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { artist, date, image, internalID, medium, mediumType, slug, title } = artwork

  const isP1Artist = artwork.artist?.targetSupply?.isP1
  const isHighDemand = Number((artwork.marketPriceInsights?.demandRank || 0) * 10) >= 9
  const showHighDemandIcon = isP1Artist && isHighDemand

  return (
    <Touchable
      testID="list-item-touchable"
      underlayColor="black5"
      onPress={() => {
        trackEvent(tracks.tappedCollectedArtwork(internalID, slug))

        navigate(`/my-collection/artwork/${slug}`, {
          passProps: { medium, category: mediumType?.name, artistInternalID: artist?.internalID },
        })
      }}
    >
      <Flex pb={1} flexDirection="row">
        <ListItemImageView image={image} />

        <Flex pl="15px" flex={1} style={{ marginTop: 3 }}>
          {!!artist?.name && (
            <Text variant="xs" testID="artist-name">
              {artist?.name}
            </Text>
          )}
          {!!title && (
            <Text variant="xs" italic color="black60" testID="artwork-title">
              {title}
              <Text variant="xs" color="black60" testID="artwork-date">
                {date ? `, ${date}` : ""}
              </Text>
            </Text>
          )}
          {!!medium && (
            <Text variant="xs" color="black60" testID="artwork-medium">
              {medium}
            </Text>
          )}
        </Flex>

        {!!showHighDemandIcon && (
          <Flex
            testID="test-high-demand-icon"
            alignSelf="flex-start"
            alignItems="center"
            flexDirection="row"
            style={{ marginTop: 3 }}
          >
            <HighDemandIcon style={{ marginTop: 2 }} />
            <Text ml={0.5} variant="xs" color="blue100">
              High Demand
            </Text>
          </Flex>
        )}
      </Flex>
    </Touchable>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkListItem_artwork on Artwork {
    internalID
    title
    slug
    id
    medium
    mediumType {
      name
    }
    image(includeAll: true) {
      internalID
      url(version: "small")
      versions
      aspectRatio
      width
      height
    }
    artistNames
    medium
    artist {
      internalID
      name
      targetSupply {
        isP1
      }
    }
    pricePaid {
      minor
    }
    sizeBucket
    width
    height
    date
    marketPriceInsights {
      demandRank
    }
    submissionId
  }
`

const tracks = {
  tappedCollectedArtwork: (targetID: string, targetSlug: string) => {
    return tappedCollectedArtwork({
      destinationOwnerId: targetID,
      destinationOwnerSlug: targetSlug,
    })
  },
}
