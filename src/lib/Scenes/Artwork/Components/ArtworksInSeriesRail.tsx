import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedArtworkGroup,
} from "@artsy/cohesion"
import { ArtworksInSeriesRail_artwork } from "__generated__/ArtworksInSeriesRail_artwork.graphql"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { ArrowRightIcon, Flex, Sans, Spacer } from "palette"
import React from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksInSeriesRailProps {
  artwork: ArtworksInSeriesRail_artwork
}

export const ArtworksInSeriesRail: React.FC<ArtworksInSeriesRailProps> = ({ artwork }) => {
  const { trackEvent } = useTracking()

  const artistSeriesSlug = artwork?.artistSeriesConnection?.edges?.[0]?.node?.slug
  const artistSeriesID = artwork?.artistSeriesConnection?.edges?.[0]?.node?.internalID
  const filterArtworksConnection =
    artwork?.artistSeriesConnection?.edges?.[0]?.node?.filterArtworksConnection

  if (!filterArtworksConnection) {
    return null
  }

  const artworks = extractNodes(filterArtworksConnection)

  const trackingContext = {
    context_module: ContextModule.moreFromThisSeries,
    context_screen_owner_type: OwnerType.artwork as ScreenOwnerType,
    context_screen_owner_id: artwork.internalID,
    context_screen_owner_slug: artwork.slug,
  }

  const trackHeaderClick = ({
    destinationScreenOwnerID,
    destinationScreenOwnerSlug,
  }: {
    destinationScreenOwnerID: string
    destinationScreenOwnerSlug: string
  }) => {
    const properties: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      ...trackingContext,
      destination_screen_owner_type: OwnerType.artistSeries,
      destination_screen_owner_slug: destinationScreenOwnerSlug,
      destination_screen_owner_id: destinationScreenOwnerID,
      type: "viewAll",
    }

    trackEvent(properties)
  }

  const trackArtworkClick = ({
    destinationScreenOwnerID,
    destinationScreenOwnerSlug,
  }: {
    destinationScreenOwnerID: string
    destinationScreenOwnerSlug: string
  }) => {
    const properties: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      ...trackingContext,
      destination_screen_owner_type: OwnerType.artwork,
      destination_screen_owner_slug: destinationScreenOwnerSlug,
      destination_screen_owner_id: destinationScreenOwnerID,
      type: "thumbnail",
    }

    trackEvent(properties)
  }

  return (
    <Flex>
      <TouchableOpacity
        onPress={() => {
          trackHeaderClick({
            destinationScreenOwnerSlug: artistSeriesSlug!,
            destinationScreenOwnerID: artistSeriesID!,
          })
          navigate(`/artist-series/${artistSeriesSlug}`)
        }}
      >
        <Flex pb={1} flexDirection="row" justifyContent="space-between">
          <Sans size="4">More from this series</Sans>
          <ArrowRightIcon mr="-5px" />
        </Flex>
      </TouchableOpacity>
      <FlatList
        horizontal
        ItemSeparatorComponent={() => <Spacer width={10} />}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={5}
        windowSize={3}
        renderItem={({ item }) => (
          <ArtworkTileRailCard
            onPress={() => {
              trackArtworkClick({
                destinationScreenOwnerID: item.internalID,
                destinationScreenOwnerSlug: item.slug,
              })
              navigate(item.href!)
            }}
            imageURL={item.image?.imageURL}
            imageAspectRatio={item.image?.aspectRatio}
            imageSize="medium"
            artistNames={item.artistNames}
            title={item.title}
            partner={item.partner}
            date={item.date}
            saleMessage={saleMessageOrBidInfo({ artwork: item })}
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
      internalID
      slug
      artistSeriesConnection(first: 1) {
        edges {
          node {
            slug
            internalID
            filterArtworksConnection(first: 20, input: { sort: "-decayed_merch" }) {
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
                    counts {
                      bidderPositions
                    }
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
