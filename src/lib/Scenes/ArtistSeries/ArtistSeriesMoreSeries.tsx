import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { ArtistSeriesMoreSeries_artist } from "__generated__/ArtistSeriesMoreSeries_artist.graphql"
import { navigate } from "lib/navigation/navigate"
import { ArtistSeriesListItem } from "lib/Scenes/ArtistSeries/ArtistSeriesListItem"
import { Flex, FlexProps, Sans } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export type ArtistSeriesConnectionEdge = NonNullable<
  NonNullable<ArtistSeriesMoreSeries_artist["artistSeriesConnection"]>["edges"]
>[0]

interface ArtistSeriesMoreSeriesProps extends FlexProps {
  artist: ArtistSeriesMoreSeries_artist | null | undefined
  artistSeriesHeader: string
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
  ...rest
}) => {
  const series = artist?.artistSeriesConnection?.edges ?? []
  const excludedArtistSeriesCount = currentArtistSeriesExcluded ? 1 : 0
  const totalCount = Number(artist?.artistSeriesConnection?.totalCount ?? 0) + excludedArtistSeriesCount

  if (!artist || series.length === 0) {
    return null
  }

  return (
    <Flex {...rest}>
      <Flex mb={15} flexDirection="row" justifyContent="space-between">
        <Sans size="4t" data-test-id="header">
          {artistSeriesHeader}
        </Sans>
        {totalCount > 4 && (
          <TouchableOpacity
            onPress={() => {
              navigate(`/artist/${artist?.internalID!}/artist-series`)
            }}
          >
            <Sans data-test-id="viewAll" size="4t">{`View All (${totalCount})`}</Sans>
          </TouchableOpacity>
        )}
      </Flex>
      {series.map((item, index) => {
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

export const ArtistSeriesMoreSeriesFragmentContainer = createFragmentContainer(ArtistSeriesMoreSeries, {
  artist: graphql`
    fragment ArtistSeriesMoreSeries_artist on Artist {
      internalID
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
})
