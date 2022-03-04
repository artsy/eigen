import { tappedCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkListItem_artwork$key } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import { MyCollectionArtworkListItemQuery } from "__generated__/MyCollectionArtworkListItemQuery.graphql"
import { FadeIn } from "app/Components/FadeIn"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { TrendingIcon } from "app/Icons/TrendingIcon"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React, { useEffect, useState } from "react"
import { useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { fetchQuery, graphql } from "relay-runtime"

export const ARTWORK_LIST_IMAGE_SIZE = 80

export const MyCollectionArtworkListItem: React.FC<{
  artwork: MyCollectionArtworkListItem_artwork$key
}> = ({ ...restProps }) => {
  const { trackEvent } = useTracking()
  const [trending, setTrending] = useState(false)

  const artwork = useFragment<MyCollectionArtworkListItem_artwork$key>(
    artworkFragment,
    restProps.artwork
  )

  const isPOneArtist =
    !!artwork.artists?.find((artist) => Boolean(artist?.targetSupply?.isTargetSupply)) ??
    !!artwork.artist?.targetSupply?.isTargetSupply ??
    false

  const AREnableNewMyCollectionArtwork = useFeatureFlag("AREnableNewMyCollectionArtwork")

  const fetchDemandRank = async (): Promise<number | null> => {
    if (artwork.artist?.internalID && artwork.medium) {
      try {
        const res = await fetchQuery<MyCollectionArtworkListItemQuery>(
          defaultEnvironment,
          graphql`
            query MyCollectionArtworkListItemQuery($internalID: ID!, $medium: String!) {
              marketPriceInsights(artistId: $internalID, medium: $medium) {
                demandRank
              }
            }
          `,
          { internalID: artwork.artist.internalID, medium: artwork.medium }
        ).toPromise()

        if (res?.marketPriceInsights?.demandRank) {
          setTrending(Number(res.marketPriceInsights.demandRank * 10) >= 9)
        }
      } catch (e) {
        console.error(e)
        return null
      }
    }
    return null
  }

  useEffect(() => {
    if (isPOneArtist && AREnableNewMyCollectionArtwork) {
      fetchDemandRank()
    }
  }, [])

  const showTrendingIcon = AREnableNewMyCollectionArtwork && trending

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

        {!!showTrendingIcon && (
          <FadeIn>
            <Flex
              alignSelf="flex-start"
              alignItems="center"
              flexDirection="row"
              style={{ marginTop: 3 }}
            >
              <TrendingIcon style={{ marginTop: 2 }} />
              <Text ml={0.5} variant="xs" color="blue100">
                High Demand
              </Text>
            </Flex>
          </FadeIn>
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
        isTargetSupply
      }
    }
    artists {
      targetSupply {
        isTargetSupply
      }
    }
    pricePaid {
      minor
    }
    sizeBucket
    width
    height
    date
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
