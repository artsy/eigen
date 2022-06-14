import { tappedCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkListItem_artwork$key } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import HighDemandIcon from "app/Icons/HighDemandIcon"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React from "react"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"

export const ARTWORK_LIST_IMAGE_SIZE = 80

export const MyCollectionArtworkListItem: React.FC<{
  artwork: MyCollectionArtworkListItem_artwork$key
}> = ({ ...restProps }) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { artist, date, image, internalID, medium, slug, title } = artwork

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
          passProps: { medium, artistInternalID: artist?.internalID },
        })
      }}
    >
      <Flex pb={1} flexDirection="row">
        {!image?.url ? (
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
        ) : (
          <Flex
            width={ARTWORK_LIST_IMAGE_SIZE}
            height={ARTWORK_LIST_IMAGE_SIZE}
            borderRadius={2}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <OpaqueImageView
              width={ARTWORK_LIST_IMAGE_SIZE}
              height={ARTWORK_LIST_IMAGE_SIZE}
              imageURL={image.url}
              aspectRatio={image.aspectRatio}
            />
          </Flex>
        )}

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
    image {
      url(version: "small")
      aspectRatio
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
