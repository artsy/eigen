import { AverageSalePriceAtAuctionQuery } from "__generated__/AverageSalePriceAtAuctionQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React, { Suspense, useCallback, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { AverageSalePriceSelectArtistModal } from "./AverageSalePriceSelectArtistModal"
interface AverageSalePriceAtAuctionProps {
  refetch: (newArtistID: string) => void
  queryArgs: { options: { fetchKey: number }; variables: { artistID: string } }
}

const AverageSalePriceAtAuctionScreen: React.FC<AverageSalePriceAtAuctionProps> = ({
  refetch,
  queryArgs,
}) => {
  const [isVisible, setVisible] = useState<boolean>(false)

  const data = useLazyLoadQuery<AverageSalePriceAtAuctionQuery>(
    AverageSalePriceAtAuctionScreenQuery,
    queryArgs.variables,
    queryArgs.options
  )

  const enableChangeArtist =
    data.me?.myCollectionInfo?.artistsCount && data.me?.myCollectionInfo?.artistsCount > 0

  return (
    <Flex mx={2} pt={6}>
      <Text variant="lg" mb={0.5} testID="Average_Auction_Price_title">
        Average Auction Price
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

      <AverageSalePriceSelectArtistModal
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

export const AverageSalePriceAtAuction: React.FC<{ artistID: string }> = ({ artistID }) => {
  const [queryArgs, setQueryArgs] = useState({
    options: { fetchKey: 0 },
    variables: { artistID },
  })

  const refetch = useCallback((newArtistID) => {
    setQueryArgs((prev) => ({
      options: { fetchKey: (prev?.options.fetchKey ?? 0) + 1 },
      variables: { artistID: newArtistID },
    }))
  }, [])

  return (
    <Suspense fallback={null}>
      <AverageSalePriceAtAuctionScreen refetch={refetch} queryArgs={queryArgs} />
    </Suspense>
  )
}

const AverageSalePriceAtAuctionScreenQuery = graphql`
  query AverageSalePriceAtAuctionQuery($artistID: String!) {
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
