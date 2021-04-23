import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistNotableWorksRail_artist } from "__generated__/ArtistNotableWorksRail_artist.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { Box, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface ArtistNotableWorksRailProps {
  artist: ArtistNotableWorksRail_artist
}

type NotableArtwork = NonNullable<NonNullable<ArtistNotableWorksRail_artist["filterArtworksConnection"]>["edges"]>[0]

const ArtistNotableWorksRail: React.FC<ArtistNotableWorksRailProps> = ({ artist }) => {
  const artworks = artist?.filterArtworksConnection?.edges ?? []

  if (!artist || artworks.length <= 2) {
    return null
  }

  const { trackEvent } = useTracking()

  const handleNavigation = (id: string | undefined, slug: string | undefined, position: number) => {
    if (!slug || !id) {
      return
    }

    trackEvent(tracks.tapArtwork(artist.internalID, artist.slug, id, slug, position))

    return navigate(`/artwork/${slug}`)
  }
  const saleMessage = (artwork: NotableArtwork) => {
    const sale = artwork?.node?.sale
    const isAuction = sale?.isAuction

    if (isAuction) {
      const showBiddingClosed = sale?.isClosed
      if (showBiddingClosed) {
        return "Bidding closed"
      } else {
        const highestBidDisplay = artwork?.node?.saleArtwork?.highestBid?.display ?? ""
        const openingBidDisplay = artwork?.node?.saleArtwork?.openingBid?.display ?? ""

        return highestBidDisplay || openingBidDisplay || ""
      }
    }

    return artwork?.node?.saleMessage
  }

  return (
    <Box>
      <Box mt={1}>
        <SectionTitle title="Notable Works" />
      </Box>
      <ArtistNotableWorksRailWrapper>
        <AboveTheFoldFlatList<NotableArtwork>
          horizontal
          ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
          ListFooterComponent={() => <Spacer mr={2}></Spacer>}
          ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={artworks}
          initialNumToRender={3}
          windowSize={3}
          renderItem={({ item, index }) => {
            return (
              <ArtworkTileRailCard
                imageURL={item?.node?.image?.imageURL}
                imageAspectRatio={item?.node?.image?.aspectRatio}
                imageSize="large"
                title={item?.node?.title}
                saleMessage={saleMessage(item)}
                key={item?.node?.internalID}
                onPress={() => {
                  handleNavigation(item?.node?.internalID, item?.node?.slug, index)
                }}
              />
            )
          }}
          keyExtractor={(item, index) => String(item?.node?.internalID || index)}
        />
      </ArtistNotableWorksRailWrapper>
    </Box>
  )
}

const ArtistNotableWorksRailWrapper = styled(Box)`
  margin: 0px -20px 20px -20px;
`

export const ArtistNotableWorksRailFragmentContainer = createFragmentContainer(ArtistNotableWorksRail, {
  artist: graphql`
    fragment ArtistNotableWorksRail_artist on Artist {
      internalID
      slug
      # this should match the notableWorks query in ArtistArtworks
      filterArtworksConnection(sort: "-weighted_iconicity", first: 10) {
        edges {
          node {
            id
            image {
              imageURL
              aspectRatio
            }
            saleMessage
            saleArtwork {
              openingBid {
                display
              }
              highestBid {
                display
              }
            }
            sale {
              isClosed
              isAuction
            }
            title
            internalID
            slug
          }
        }
      }
    }
  `,
})

export const tracks = {
  tapArtwork: (artistId: string, artistSlug: string, artworkId: string, artworkSlug: string, position: number) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.topWorksRail,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    destination_screen_owner_type: OwnerType.artwork,
    destination_screen_owner_id: artworkId,
    destination_screen_owner_slug: artworkSlug,
    horizontal_slide_position: position,
    module_height: "double",
    type: "thumbnail",
  }),
}
