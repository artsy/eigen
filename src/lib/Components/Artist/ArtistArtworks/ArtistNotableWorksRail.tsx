import { ArtistNotableWorksRail_artist } from "__generated__/ArtistNotableWorksRail_artist.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { Box, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
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

  const handleNavigation = (slug: string | undefined) => {
    if (!slug) {
      return
    }
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
      <Box mt="1">
        <SectionTitle title="Notable Works" />
      </Box>
      <ArtistNotableWorksRailWrapper>
        <AboveTheFoldFlatList<NotableArtwork>
          horizontal
          ListHeaderComponent={() => <Spacer mr="2" />}
          ListFooterComponent={() => <Spacer mr="2" />}
          ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={artworks}
          initialNumToRender={3}
          windowSize={3}
          renderItem={({ item }) => {
            return (
              <ArtworkTileRailCard
                imageURL={item?.node?.image?.imageURL}
                imageAspectRatio={item?.node?.image?.aspectRatio}
                imageSize="large"
                title={item?.node?.title}
                saleMessage={saleMessage(item)}
                key={item?.node?.internalID}
                onPress={() => {
                  handleNavigation(item?.node?.slug)
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
