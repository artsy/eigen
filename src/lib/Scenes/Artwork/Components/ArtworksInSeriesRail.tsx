import { ArrowRightIcon, Flex, Sans, Spacer } from "@artsy/palette"
import { ArtworksInSeriesRail_artwork } from "__generated__/ArtworksInSeriesRail_artwork.graphql"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import React, { Component, useRef } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworksInSeriesRailProps {
  artwork: ArtworksInSeriesRail_artwork
}

export const ArtworksInSeriesRail: React.FC<ArtworksInSeriesRailProps> = ({ artwork }) => {
  const navRef = useRef<Component>(null)

  const artistSeriesSlug = artwork?.artistSeriesConnection?.edges?.[0]?.node?.slug
  const artworksConnection = artwork?.artistSeriesConnection?.edges?.[0]?.node?.artworksConnection

  if (!artworksConnection) {
    return null
  }

  const artworks = extractNodes(artworksConnection)

  return (
    <Flex ref={navRef}>
      <TouchableOpacity
        onPress={() => {
          SwitchBoard.presentNavigationViewController(navRef.current!, `/artist-series/${artistSeriesSlug}`)
        }}
      >
        <Flex pb={1} flexDirection="row" justifyContent="space-between">
          <Sans size="4">More from this series</Sans>
          <ArrowRightIcon mr="-5px" />
        </Flex>
      </TouchableOpacity>
      <FlatList
        horizontal
        ItemSeparatorComponent={() => <Spacer width={10}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={5}
        windowSize={3}
        renderItem={({ item }) => (
          <ArtworkTileRailCard
            onPress={() => {
              SwitchBoard.presentNavigationViewController(navRef.current!, item.href!)
            }}
            imageURL={item.image?.imageURL}
            imageAspectRatio={item.image?.aspectRatio}
            imageSize="medium"
            artistNames={item.artistNames}
            title={item.title}
            partner={item.partner}
            date={item.date}
            saleMessage={saleMessageOrBidInfo(item)}
            key={item.internalID}
          />
        )}
        keyExtractor={(item, index) => String(item.image?.imageURL || index)}
      />
    </Flex>
  )
}

export const ArtworksInSeriesRailFragmentContainer = createFragmentContainer(ArtworksInSeriesRail, {
  artwork: graphql`
    fragment ArtworksInSeriesRail_artwork on Artwork {
      artistSeriesConnection(first: 1) {
        edges {
          node {
            slug
            artworksConnection(first: 20) {
              edges {
                node {
                  slug
                  internalID
                  href
                  artistNames
                  image {
                    imageURL
                    aspectRatio
                  }
                  sale {
                    isAuction
                    isClosed
                    displayTimelyAt
                  }
                  saleArtwork {
                    currentBid {
                      display
                    }
                  }
                  saleMessage
                  title
                  date
                  partner {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
})
