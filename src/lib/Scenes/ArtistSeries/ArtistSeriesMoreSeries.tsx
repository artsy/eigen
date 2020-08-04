import { ArrowRightIcon, color, Flex, FlexProps, Sans } from "@artsy/palette"
import { ArtistSeriesMoreSeries_artist } from "__generated__/ArtistSeriesMoreSeries_artist.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { Component, useRef } from "react"
import { TouchableHighlight, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

type ArtistSeriesConnectionEdge = NonNullable<
  NonNullable<ArtistSeriesMoreSeries_artist["artistSeriesConnection"]>["edges"]
>[0]

interface ArtistSeriesMoreSeriesProps extends FlexProps {
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
    <TouchableHighlight underlayColor={color("black5")} onPress={() => handleNavigation(artistSeriesItem.slug)}>
      <Flex px={2} py={5} key={artistSeriesItem.internalID} flexDirection="row" justifyContent="space-between">
        <Flex flexDirection="row">
          <OpaqueImageView
            imageURL={artistSeriesItem.image?.url}
            height={70}
            width={70}
            style={{ borderRadius: 2, overflow: "hidden" }}
          />
          <Flex ml={1} justifyContent="center">
            <Sans size="3t">{artistSeriesItem.title}</Sans>
            <Sans size="3" color="black60">
              {artistSeriesItem.forSaleArtworksCount} available
            </Sans>
          </Flex>
        </Flex>
        <Flex justifyContent="center">
          <ArrowRightIcon mr="-5px" />
        </Flex>
      </Flex>
    </TouchableHighlight>
  )
}

export const ArtistSeriesMoreSeries: React.FC<ArtistSeriesMoreSeriesProps> = ({ artist, ...rest }) => {
  const navRef = useRef<Component>(null)
  const handleNavigation = (slug: string) => {
    if (!!navRef) {
      return SwitchBoard.presentNavigationViewController(navRef.current!, `/artist-series/${slug}`)
    } else {
      return null
    }
  }

  const series = artist?.artistSeriesConnection?.edges ?? []

  if (series.length === 0) {
    return null
  }

  return (
    <Flex {...rest} ref={navRef}>
      <Flex mb="15px" px={2} mt={2} flexDirection="row" justifyContent="space-between">
        <Sans size="4t">More series by this artist</Sans>
        <TouchableOpacity
          onPress={() => {
            SwitchBoard.presentNavigationViewController(navRef.current!, `/artist/${artist?.internalID!}/artist-series`)
          }}
        >
          <Sans size="4t">View all</Sans>
        </TouchableOpacity>
      </Flex>
      {series.map((item, index) => {
        const artistSeriesItem = item?.node
        if (!!artistSeriesItem) {
          return (
            <ArtistSeriesMoreSeriesItem
              artistSeriesItem={artistSeriesItem}
              handleNavigation={handleNavigation}
              key={artistSeriesItem?.internalID ?? index}
            />
          )
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
      internalID
      slug
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
