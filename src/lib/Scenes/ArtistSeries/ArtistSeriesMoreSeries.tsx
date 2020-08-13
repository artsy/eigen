import { Flex, FlexProps, Sans } from "@artsy/palette"
import { ArtistSeriesMoreSeries_artist } from "__generated__/ArtistSeriesMoreSeries_artist.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ArtistSeriesListItem } from "lib/Scenes/ArtistSeries/ArtistSeriesListItem"
import React, { Component, useRef } from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export type ArtistSeriesConnectionEdge = NonNullable<
  NonNullable<ArtistSeriesMoreSeries_artist["artistSeriesConnection"]>["edges"]
>[0]

interface ArtistSeriesMoreSeriesProps extends FlexProps {
  artist: ArtistSeriesMoreSeries_artist | null | undefined
  artistSeriesHeader: string
  currentArtistSeriesExcluded?: boolean
}

export const ArtistSeriesMoreSeries: React.FC<ArtistSeriesMoreSeriesProps> = ({
  artist,
  artistSeriesHeader,
  currentArtistSeriesExcluded,
  ...rest
}) => {
  const navRef = useRef<Component>(null)
  const series = artist?.artistSeriesConnection?.edges ?? []
  const excludedArtistSeriesCount = currentArtistSeriesExcluded ? 1 : 0
  const totalCount = Number(artist?.artistSeriesConnection?.totalCount ?? 0) + excludedArtistSeriesCount

  if (!artist || series.length === 0) {
    return null
  }

  return (
    <Flex {...rest} ref={navRef}>
      <Flex mb="15px" flexDirection="row" justifyContent="space-between">
        <Sans size="4t" data-test-id="header">
          {artistSeriesHeader}
        </Sans>
        {totalCount > 4 && (
          <TouchableOpacity
            onPress={() => {
              SwitchBoard.presentNavigationViewController(
                navRef.current!,
                `/artist/${artist?.internalID!}/artist-series`
              )
            }}
          >
            <Sans data-test-id="viewAll" size="4t">{`View All (${totalCount})`}</Sans>
          </TouchableOpacity>
        )}
      </Flex>
      {series.map((item, index) => {
        const artistSeriesItem = item?.node

        return (
          !!artistSeriesItem && <ArtistSeriesListItem listItem={item} key={artistSeriesItem?.internalID ?? index} />
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
