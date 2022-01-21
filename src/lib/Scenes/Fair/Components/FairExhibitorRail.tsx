import { ActionType, ContextModule, OwnerType, TappedArtworkGroup } from "@artsy/cohesion"
import { FairExhibitorRail_show } from "__generated__/FairExhibitorRail_show.graphql"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { getUrgencyTag } from "lib/utils/getUrgencyTag"
import { Box, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface FairExhibitorRailProps {
  show: FairExhibitorRail_show
}

const FairExhibitorRail: React.FC<FairExhibitorRailProps> = ({ show }) => {
  const tracking = useTracking()
  const artworks = show?.artworks?.edges!.map((item) => item?.node)
  const count = show?.counts?.artworks ?? 0
  const partnerName = show?.partner?.name ?? ""
  const viewAllUrl = show?.href

  const trackTappedArtwork = (artworkID: string, artworkSlug: string, position: number) => {
    const trackTappedArtworkProps: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.galleryBoothRail,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: show.fair?.internalID ?? "",
      context_screen_owner_slug: show.fair?.slug ?? "",
      destination_screen_owner_type: OwnerType.artwork,
      destination_screen_owner_id: artworkID,
      destination_screen_owner_slug: artworkSlug,
      horizontal_slide_position: position,
      type: "thumbnail",
    }
    tracking.trackEvent(trackTappedArtworkProps)
  }

  const trackTappedShow = (showInternalID: string, showSlug: string) => {
    const trackTappedShowProps: TappedArtworkGroup = {
      action: ActionType.tappedArtworkGroup,
      context_module: ContextModule.galleryBoothRail,
      context_screen_owner_type: OwnerType.fair,
      context_screen_owner_id: show.fair?.internalID ?? "",
      context_screen_owner_slug: show.fair?.slug ?? "",
      destination_screen_owner_type: OwnerType.show,
      destination_screen_owner_id: showInternalID,
      destination_screen_owner_slug: showSlug,
      type: "viewAll",
    }
    tracking.trackEvent(trackTappedShowProps)
  }

  if (count === 0) {
    return null
  }

  return (
    <>
      <Box px={2}>
        <SectionTitle
          title={partnerName}
          subtitle={`${count} works`}
          onPress={() => {
            if (!viewAllUrl) {
              return
            }
            trackTappedShow(show.internalID, show.slug)
            navigate(viewAllUrl)
          }}
        />
      </Box>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2} />}
        ListFooterComponent={() => <Spacer mr={2} />}
        ItemSeparatorComponent={() => <Spacer width={15} />}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={3}
        windowSize={3}
        renderItem={({ item, index }) => {
          return (
            <ArtworkTileRailCard
              onPress={() => {
                trackTappedArtwork(item?.internalID ?? "", item?.slug ?? "", index)
                navigate(item?.href!)
              }}
              imageURL={item?.image?.imageURL ?? ""}
              imageSize="small"
              useSquareAspectRatio
              artistNames={item?.artistNames}
              saleMessage={item && saleMessageOrBidInfo({ artwork: item, isSmallTile: true })}
              urgencyTag={
                item?.sale?.isAuction && !item?.sale?.isClosed
                  ? getUrgencyTag(item?.sale?.endAt)
                  : null
              }
            />
          )
        }}
        keyExtractor={(item, index) => String(item?.internalID || index)}
      />
    </>
  )
}

export const FairExhibitorRailFragmentContainer = createFragmentContainer(FairExhibitorRail, {
  show: graphql`
    fragment FairExhibitorRail_show on Show {
      internalID
      slug
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
      fair {
        internalID
        slug
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
