import { ArrowRightIcon, Flex, Sans } from "@artsy/palette"
import { ArtistSeriesMoreSeries_artist } from "__generated__/ArtistSeriesMoreSeries_artist.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

type Mutable<T> = { -readonly [P in keyof T]: T[P] }
type MutableArtistSeriesList = Mutable<NonNullable<ArtistSeriesMoreSeries_artist["artistSeriesConnection"]>["edges"]>
type ArtistSeriesConnectionEdge = NonNullable<
  NonNullable<ArtistSeriesMoreSeries_artist["artistSeriesConnection"]>["edges"]
>[0]

interface ArtistSeriesMoreSeriesProps {
  artist: ArtistSeriesMoreSeries_artist | null | undefined
}

interface ArtistSeriesMoreSeriesItemProps {
  artistSeriesItem: NonNullable<NonNullable<ArtistSeriesConnectionEdge>["node"]>
  handleNavigation: (slug: string) => void
}

export const ArtistSeriesMoreSeriesItem: React.FC<ArtistSeriesMoreSeriesItemProps> = ({
  artistSeriesItem,
  handleNavigation,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleNavigation(artistSeriesItem.slug)}>
      <Flex key={artistSeriesItem.internalID} flexDirection="row" justifyContent="space-between" mb={1}>
        <Flex flexDirection="row">
          <OpaqueImageView
            imageURL={artistSeriesItem.image?.url}
            height={70}
            width={70}
            style={{ borderRadius: 2, overflow: "hidden" }}
          />
          <Flex ml={1} justifyContent="center" flexDirection="column">
            <Sans size="3t">{artistSeriesItem.title}</Sans>
            <Sans size="3" color="black60">
              {`${artistSeriesItem.forSaleArtworksCount} available`}
            </Sans>
          </Flex>
        </Flex>
        <Flex justifyContent="center">
          <ArrowRightIcon />
        </Flex>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

export const ArtistSeriesMoreSeries: React.FC<ArtistSeriesMoreSeriesProps> = ({ artist }) => {
  const navRef = useRef<any>()
  const handleNavigation = (slug: string) => {
    return SwitchBoard.presentNavigationViewController(navRef.current, `/artist-series/${slug}`)
  }

  const series = artist?.artistSeriesConnection?.edges ?? []

  if (series.length === 0) {
    return null
  }

  const sortedSeries: MutableArtistSeriesList = series
    .concat()
    .sort((a: ArtistSeriesConnectionEdge, b: ArtistSeriesConnectionEdge) => {
      return Math.sign((b?.node?.forSaleArtworksCount ?? 0) - (a?.node?.forSaleArtworksCount ?? 0))
    })

  return (
    <Flex ref={navRef}>
      <Sans my={2} size="4t">
        More series by this artist
      </Sans>
      {sortedSeries.map(item => {
        const artistSeriesItem = item?.node
        if (!!artistSeriesItem) {
          return <ArtistSeriesMoreSeriesItem artistSeriesItem={artistSeriesItem} handleNavigation={handleNavigation} />
        } else {
          return null
        }
      })}
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
