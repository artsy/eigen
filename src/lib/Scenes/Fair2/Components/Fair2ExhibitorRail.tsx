import { Fair2ExhibitorRail_show } from "__generated__/Fair2ExhibitorRail_show.graphql"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { getUrgencyTag } from "lib/utils/getUrgencyTag"
import { Box, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Fair2ExhibitorRailProps {
  show: Fair2ExhibitorRail_show
}

const Fair2ExhibitorRail: React.FC<Fair2ExhibitorRailProps> = ({ show }) => {
  const artworks = show?.artworks?.edges!.map((item) => item?.node)
  const count = show?.counts?.artworks ?? 0
  const partnerName = show?.partner?.name ?? ""
  const viewAllUrl = show?.href

  if (count === 0) {
    return null
  }

  return (
    <>
      <Box px={2} pb={1}>
        <SectionTitle
          title={partnerName}
          subtitle={`${count} works`}
          onPress={() => {
            if (!viewAllUrl) {
              return
            }
            navigate(viewAllUrl)
          }}
        />
      </Box>
      <FlatList
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
              onPress={() => navigate(item?.href!)}
              imageURL={item?.image?.imageURL ?? ""}
              imageSize="small"
              useSquareAspectRatio
              artistNames={item?.artistNames}
              saleMessage={item && saleMessageOrBidInfo({ artwork: item, isSmallTile: true })}
              urgencyTag={item?.sale?.isAuction && !item?.sale?.isClosed ? getUrgencyTag(item?.sale?.endAt) : null}
            />
          )
        }}
        keyExtractor={(item, index) => String(item?.internalID || index)}
      />
    </>
  )
}

export const Fair2ExhibitorRailFragmentContainer = createFragmentContainer(Fair2ExhibitorRail, {
  show: graphql`
    fragment Fair2ExhibitorRail_show on Show {
      internalID
      href
      partner {
        ... on Partner {
          name
        }
        ... on ExternalPartner {
          name
        }
      }
      counts {
        artworks
      }
      artworks: artworksConnection(first: 20) {
        edges {
          node {
            href
            artistNames
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
              currentBid {
                display
              }
              counts {
                bidderPositions
              }
            }
            sale {
              isClosed
              isAuction
              endAt
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
