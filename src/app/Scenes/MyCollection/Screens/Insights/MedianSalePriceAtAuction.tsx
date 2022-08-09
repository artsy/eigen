import { MedianSalePriceAtAuctionQuery } from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React, { Suspense, useCallback, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { SelectArtistModal } from "./SelectArtistModal"

const PAGE_SIZE = 50

interface MedianSalePriceAtAuctionProps {
  refetch: (newArtistID: string) => void
  queryArgs: Record<string, any>
}

const MedianSalePriceAtAuctionScreen: React.FC<MedianSalePriceAtAuctionProps> = ({
  refetch,
  queryArgs,
}) => {
  const enableMyCollectionInsightsMedianPrice = useFeatureFlag(
    "AREnableMyCollectionInsightsMedianPrice"
  )

  const [isVisible, setVisible] = useState<boolean>(false)

  const data = useLazyLoadQuery<MedianSalePriceAtAuctionQuery>(
    MedianSalePriceAtAuctionScreenQuery,
    queryArgs.variables,
    queryArgs.options
  )

  const enableChangeArtist =
    !!data.me?.myCollectionInfo?.artistsCount && data.me.myCollectionInfo.artistsCount > 1

  return (
    <Flex mx={2} pt={6}>
      <Text variant="lg" mb={0.5} testID="Median_Auction_Price_title">
        {enableMyCollectionInsightsMedianPrice ? "Median Auction Price" : "Average Auction Price"}
      </Text>
      <Text variant="xs">Track price stability or growth for your artists.</Text>

      {/* Artists Info */}
      <Flex py={2} flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor="black10"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          // To align the image with the text we have to add top margin to compensate the line height.
          style={{ marginTop: 3 }}
        >
          {data.artist?.imageUrl ? (
            <OpaqueImageView width={40} height={40} imageURL={data.artist.imageUrl} />
          ) : (
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          )}
        </Flex>
        {/* Sale Artwork Artist Name */}
        <Flex flex={1} pl={1}>
          {!!data.artist?.name && (
            <Text variant="md" ellipsizeMode="middle" numberOfLines={2}>
              {data.artist.name}
            </Text>
          )}
        </Flex>

        {!!enableChangeArtist && (
          <Touchable testID="change-artist-touchable" onPress={() => setVisible(true)} haptic>
            <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
              Change Artist
            </Text>
          </Touchable>
        )}
      </Flex>

      <SelectArtistModal
        queryData={data}
        visible={isVisible}
        closeModal={() => setVisible(false)}
        onItemPress={(artistId) => {
          refetch(artistId)
          setVisible(false)
        }}
      />
    </Flex>
  )
}

export const MedianSalePriceAtAuction: React.FC<{ artistID: string }> = ({ artistID }) => {
  const [queryArgs, setQueryArgs] = useState({
    options: { fetchKey: 0 },
    variables: { ...artistsQueryVariables, artistID },
  })

  const refetch = useCallback((newArtistID) => {
    if (newArtistID !== queryArgs.variables.artistID) {
      setQueryArgs((prev) => ({
        options: { fetchKey: (prev?.options.fetchKey ?? 0) + 1 },
        variables: { ...artistsQueryVariables, artistID: newArtistID },
      }))
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <MedianSalePriceAtAuctionScreen refetch={refetch} queryArgs={queryArgs} />
    </Suspense>
  )
}

export const MedianSalePriceAtAuctionScreenQuery = graphql`
  query MedianSalePriceAtAuctionQuery($artistID: String!, $count: Int, $after: String) {
    ...SelectArtistModal_myCollectionInfo @arguments(count: $count, after: $after)
    artist(id: $artistID) {
      internalID
      name
      imageUrl
    }
    me {
      myCollectionInfo {
        artistsCount
      }
    }
  }
`

export const artistsQueryVariables = {
  count: PAGE_SIZE,
}
