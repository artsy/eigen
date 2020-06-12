import { Box, Sans, Spacer } from "@artsy/palette"
import { ArtistNotableWorksRail_artist } from "__generated__/ArtistNotableWorksRail_artist.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ArtistNotableWorksRailProps {
  artist: ArtistNotableWorksRail_artist
  hasCollection: boolean
}

type NotableArtwork = ArtistNotableWorksRail_artist["filterArtworksConnection"]["edges"][0]

const ArtistNotableWorksRail: React.FC<ArtistNotableWorksRailProps> = ({ artist, hasCollection }) => {
  const artworks = artist?.filterArtworksConnection?.edges ?? []

  if (!artist || artworks.length <= 2) {
    return null
  }

  const navRef = React.useRef<any>()

  const handleNavigation = (slug: NotableArtwork["filterArtworksConnection"]["edges"][0]["slug"]) => {
    return SwitchBoard.presentNavigationViewController(navRef.current, `/artwork/${slug}`)
  }
  const saleMessage = (artwork: NotableArtwork) => {
    const { sale } = artwork
    const isAuction = sale?.isAuction

    if (isAuction) {
      const showBiddingClosed = sale?.isClosed
      if (showBiddingClosed) {
        return "Bidding closed"
      } else {
        const highestBidDisplay = artwork?.saleArtwork?.highestBid?.display ?? ""
        const openingBidDisplay = artwork?.saleArtwork?.openingBid?.display ?? ""

        return highestBidDisplay || openingBidDisplay || ""
      }
    }

    return artwork.saleMessage
  }

  return (
    <Box>
      <Sans size="4" mb={1}>
        Notable Works
      </Sans>
      <ArtistNotableWorksRailWrapper>
        <AboveTheFoldFlatList<NotableArtwork>
          listRef={navRef}
          horizontal
          ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
          ListFooterComponent={() => <Spacer mr={2}></Spacer>}
          ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={artworks}
          initialNumToRender={3}
          windowSize={3}
          renderItem={({ item }) => {
            return (
              <ArtworkTileRailCard
                imageURL={item?.node?.image?.imageURL}
                artistNames={item?.node?.title}
                saleMessage={saleMessage(item?.node)}
                key={item?.node?.internalID}
                useLargeImageSize
                useNormalFontWeight
                useLighterFont
                onPress={() => {
                  handleNavigation(item?.node?.slug)
                }}
              />
            )
          }}
          keyExtractor={(item, index) => String(item.image?.internalID || index)}
        />
      </ArtistNotableWorksRailWrapper>
      {!hasCollection && (
        <Sans size="4" mb={1}>
          All Works
        </Sans>
      )}
    </Box>
  )
}

const ArtistNotableWorksRailWrapper = styled(Box)`
  margin: 0px -20px 20px -20px;
`

export const ArtistNotableWorksRailFragmentContainer = createFragmentContainer(ArtistNotableWorksRail, {
  artist: graphql`
    fragment ArtistNotableWorksRail_artist on Artist {
      filterArtworksConnection(sort: "-weighted_iconicity", first: 10) {
        edges {
          node {
            id
            image {
              imageURL
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
