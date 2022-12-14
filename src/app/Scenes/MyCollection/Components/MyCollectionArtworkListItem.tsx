import { tappedCollectedArtwork } from "@artsy/cohesion"
import {
  MyCollectionArtworkListItem_artwork$data,
  MyCollectionArtworkListItem_artwork$key,
} from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import HighDemandIcon from "app/Icons/HighDemandIcon"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { LocalImage, retrieveLocalImages } from "app/utils/LocalImageStore"
import { getImageSquareDimensions } from "app/utils/resizeImage"
import { Flex, NoArtworkIcon, Text, Touchable } from "palette"
import { useEffect, useState } from "react"
import { Image as RNImage } from "react-native"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

export const ARTWORK_LIST_IMAGE_SIZE = 80

const ListItemImageView: React.FC<{
  image?: MyCollectionArtworkListItem_artwork$data["image"] | null
  localImage?: LocalImage | null
}> = ({ image, localImage }) => {
  // The order of image is important as local images are used before Gemini processed images are ready
  if (localImage) {
    return (
      <RNImage
        testID="Image-Local"
        style={{
          width: ARTWORK_LIST_IMAGE_SIZE,
          height: ARTWORK_LIST_IMAGE_SIZE,
        }}
        resizeMode="contain"
        source={{ uri: localImage.path }}
      />
    )
  } else if (image?.url) {
    const imageDimensions = getImageSquareDimensions(
      image?.height,
      image?.width,
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
          imageURL={image.url}
          width={imageDimensions.width}
          height={imageDimensions.height}
          resizeMode="contain"
          aspectRatio={image.aspectRatio}
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
  myCollectionIsRefreshing?: boolean
}> = ({ myCollectionIsRefreshing, ...restProps }) => {
  const [localImage, setLocalImage] = useState<LocalImage | null>(null)

  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { artist, date, image, internalID, medium, mediumType, slug, title, submissionId } = artwork

  useEffect(() => {
    handleImages()
  }, [myCollectionIsRefreshing])

  const handleImages = async () => {
    const [localVanillaArtworkImages, localSubmissionArtworkImages] = await Promise.all([
      retrieveLocalImages(slug),
      submissionId ? retrieveLocalImages(submissionId) : undefined,
    ])
    const localDefaultImage =
      localVanillaArtworkImages?.[0] ?? localSubmissionArtworkImages?.[0] ?? null

    setLocalImage(localDefaultImage)
  }

  const isP1Artist = artwork.artist?.targetSupply?.isP1
  const isHighDemand = Number((artwork.marketPriceInsights?.demandRank || 0) * 10) >= 9

  const showDemandIndexHints = useFeatureFlag("ARShowMyCollectionDemandIndexHints")

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
        <ListItemImageView image={image} localImage={localImage} />

        <Flex pl={15} flex={1} style={{ marginTop: 3 }}>
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

        {!!showHighDemandIcon && !!showDemandIndexHints && (
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
    image {
      url(version: "small")
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
