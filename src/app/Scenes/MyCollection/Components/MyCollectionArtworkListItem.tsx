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

  const artwork = useFragment<MyCollectionArtworkListItem_artwork$key>(
    artworkFragment,
    restProps.artwork
  )

  const isP1Artist = artwork.artist?.targetSupply?.isP1
  const isHighDemand = Number((artwork.marketPriceInsights?.demandRank || 0) * 10) >= 9

  const ARShowDemandIndexHints = useFeatureFlag("ARShowDemandIndexHints")

  const showHighDemandIcon = isP1Artist && isHighDemand

  return (
    <Touchable
      underlayColor="black5"
      onPress={() => {
        trackEvent(tracks.tappedCollectedArtwork(artwork.internalID, artwork.slug))

        navigate(`/my-collection/artwork/${artwork.slug}`, {
          passProps: {
            medium: artwork.medium,
            artistInternalID: artwork.artist?.internalID,
          },
        })
      }}
    >
      <Flex pb={1} flexDirection="row">
        {!artwork.image?.url ? (
          <Flex
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
              imageURL={artwork.image.url}
              aspectRatio={artwork.image.aspectRatio}
            />
          </Flex>
        )}

        <Flex pl={15} flex={1} style={{ marginTop: 3 }}>
          {!!artwork.artist?.name && (
            <Text variant="xs" fontWeight="bold" testID="price">
              {artwork.artist?.name}
            </Text>
          )}
          {!!artwork.title && (
            <Text variant="xs" color="black60" testID="priceUSD">
              {artwork.title}
            </Text>
          )}
          {!!artwork.medium && (
            <Text variant="xs" color="black60" testID="priceUSD">
              {artwork.medium}
            </Text>
          )}
        </Flex>

        {!!showHighDemandIcon && !!ARShowDemandIndexHints && (
          <Flex
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
