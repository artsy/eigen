import { ArrowRightIcon, Flex, Sans } from "@artsy/palette"
import { ArtistSeriesMoreSeries_artist } from "__generated__/ArtistSeriesMoreSeries_artist.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistSeriesMoreSeriesProps {
  artist: ArtistSeriesMoreSeries_artist | null | undefined
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] }
type WriteableArtistSeriesList = Writeable<
  NonNullable<ArtistSeriesMoreSeries_artist["artistSeriesConnection"]>["edges"]
>

type ArtistSeriesListItem = NonNullable<
  NonNullable<ArtistSeriesMoreSeries_artist["artistSeriesConnection"]>["edges"]
>[0]

export const ArtistSeriesMoreSeries: React.FC<ArtistSeriesMoreSeriesProps> = ({ artist }) => {
  const handleNavigation = (slug: string) => {
    return SwitchBoard.presentNavigationViewController(navRef.current, `/artist-series/${slug}`)
  }

  const artistSeriesComparator = (a: ArtistSeriesListItem, b: ArtistSeriesListItem) => {
    return Math.sign((b?.node?.forSaleArtworksCount ?? 0) - (a?.node?.forSaleArtworksCount ?? 0))
  }

  const series = artist?.artistSeriesConnection?.edges ?? []
  if (!artist || series?.length <= 1) {
    return null
  }

  const sortedSeries: WriteableArtistSeriesList = series.concat().sort(artistSeriesComparator)
  const navRef = useRef<any>()
  return (
    <Flex ref="navRef">
      <Sans my={2} size="4t">
        More series by this artist
      </Sans>
      {sortedSeries.map(item => (
        <TouchableWithoutFeedback onPress={() => handleNavigation(item?.node?.slug)}>
          <Flex key={item?.node?.internalID} flexDirection="row" mb={1}>
            <OpaqueImageView
              imageURL={item?.node?.image?.url}
              height={70}
              width={70}
              style={{ borderRadius: 2, overflow: "hidden" }}
            />
            <Flex ml={1} justifyContent="center" flexDirection="column">
              <Sans size="3t">{item?.node?.title}</Sans>
              <Sans size="3" color="black60">
                {!!item?.node?.forSaleArtworksCount && `${item?.node?.forSaleArtworksCount} available`}
              </Sans>
            </Flex>
          </Flex>
        </TouchableWithoutFeedback>
      ))}
    </Flex>
  )
}

export const ArtistSeriesMoreSeriesFragmentContainer = createFragmentContainer(ArtistSeriesMoreSeries, {
  artist: graphql`
    fragment ArtistSeriesMoreSeries_artist on Artist {
      artistSeriesConnection(first: 4) {
        edges {
          node {
            slug
            internalID
            title
            forSaleArtworksCount
            image {
              url
            }
          }
        }
      }
    }
  `,
})
