import { ActionType, ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, FlexProps, Text, TextProps } from "@artsy/palette-mobile"
import { ArtistSeriesMoreSeries_artist$data } from "__generated__/ArtistSeriesMoreSeries_artist.graphql"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import { navigate } from "app/system/navigation/navigate"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export type ArtistSeriesConnectionEdge = NonNullable<
  NonNullable<ArtistSeriesMoreSeries_artist$data["artistSeriesConnection"]>["edges"]
>[0]

interface ArtistSeriesMoreSeriesProps extends FlexProps {
  artist: ArtistSeriesMoreSeries_artist$data | null | undefined
  artistSeriesHeader: string
  headerVariant?: TextProps["variant"]
  contextScreenOwnerType: ScreenOwnerType
  contextScreenOwnerId: string
  contextScreenOwnerSlug: string
  contextModule?: ContextModule
  currentArtistSeriesExcluded?: boolean
}

export const ArtistSeriesMoreSeries: React.FC<ArtistSeriesMoreSeriesProps> = ({
  artist,
  artistSeriesHeader,
  contextModule,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  currentArtistSeriesExcluded,
  headerVariant = "sm-display",
  ...rest
}) => {
  const series = artist?.artistSeriesConnection?.edges ?? []
  const [artistSeries, setArtistSeries] = useState(series)
  const excludedArtistSeriesCount = currentArtistSeriesExcluded ? 1 : 0
  const totalCount =
    Number(artist?.artistSeriesConnection?.totalCount ?? 0) + excludedArtistSeriesCount

  // We are saving the artist series to the state here because we face a weird
  // issue where this list gets updated whenever the user navigates to the ArtistsSeries
  useEffect(() => {
    setArtistSeries(series)
  }, [])

  const { trackEvent } = useTracking()

  if (!artist || series.length === 0) {
    return null
  }

  return (
    <Flex {...rest}>
      <Flex mb="15px" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant={headerVariant} testID="header">
          {artistSeriesHeader}
        </Text>
        {totalCount > 4 && (
          <TouchableOpacity
            onPress={() => {
              if (artist.internalID) {
                trackEvent(tracks.tapViewAllArtistSeries(artist?.internalID, artist?.slug))
                navigate(`/artist/${artist?.internalID}/artist-series`)
              }
            }}
          >
            <Text variant="xs" underline testID="viewAll">{`View All (${totalCount})`}</Text>
          </TouchableOpacity>
        )}
      </Flex>
      {artistSeries.map((item, index) => {
        const artistSeriesItem = item?.node

        return (
          !!artistSeriesItem && (
            <ArtistSeriesListItem
              contextScreenOwnerId={contextScreenOwnerId}
              contextScreenOwnerSlug={contextScreenOwnerSlug}
              contextScreenOwnerType={contextScreenOwnerType}
              contextModule={contextModule}
              horizontalSlidePosition={index}
              listItem={item}
              key={artistSeriesItem?.internalID ?? index}
            />
          )
        )
      })}
    </Flex>
  )
}

export const ArtistSeriesMoreSeriesFragmentContainer = createFragmentContainer(
  ArtistSeriesMoreSeries,
  {
    artist: graphql`
      fragment ArtistSeriesMoreSeries_artist on Artist {
        internalID
        slug
        artistSeriesConnection(first: 4) {
          totalCount
          edges {
            node {
              slug
              internalID
              title
              featured
              artworksCountMessage
              image {
                url
              }
            }
          }
        }
      }
    `,
  }
)

export const tracks = {
  tapViewAllArtistSeries: (artistId: string, artistSlug: string) => ({
    action: ActionType.tappedArtistSeriesGroup,
    context_module: ContextModule.artistSeriesRail,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    destination_screen_owner_type: OwnerType.allArtistSeries,
    destination_screen_owner_id: artistId,
    destination_screen_owner_slug: artistSlug,
    type: "viewAll",
  }),
}
