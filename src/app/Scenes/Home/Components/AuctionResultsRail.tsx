import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { AuctionResultsRail_me$data } from "__generated__/AuctionResultsRail_me.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import {
  AuctionResultListItemFragmentContainer,
  AuctionResultListSeparator,
} from "app/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  title: string
  mb?: number
}

const AuctionResultsRail: React.FC<{ me: AuctionResultsRail_me$data } & Props> = ({
  title,
  me,
  mb,
}) => {
  const { trackEvent } = useTracking()
  const auctionResultsByFollowedArtists = extractNodes(me?.auctionResultsByFollowedArtists)
  const navigateToAuctionResultsForArtistsYouFollow = () => {
    trackEvent(tracks.tappedHeader())
    navigate(`/auction-results-for-artists-you-follow`)
  }

  if (!auctionResultsByFollowedArtists?.length) {
    return null
  }

  return (
    <Flex mb={mb}>
      <Flex pl="2" pr="2">
        <SectionTitle title={title} onPress={navigateToAuctionResultsForArtistsYouFollow} />
      </Flex>

      <CardRailFlatList
        data={auctionResultsByFollowedArtists}
        keyExtractor={(_, index) => String(index)}
        horizontal={false}
        initialNumToRender={3}
        ItemSeparatorComponent={AuctionResultListSeparator}
        renderItem={({ item, index }) => {
          if (!item) {
            return <></>
          }

          return (
            <AuctionResultListItemFragmentContainer
              showArtistName
              auctionResult={item}
              onPress={() => {
                trackEvent(tracks.tappedThumbnail(item.internalID, index))
                navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
              }}
            />
          )
        }}
      />
    </Flex>
  )
}

export const AuctionResultsRailFragmentContainer = createFragmentContainer(AuctionResultsRail, {
  me: graphql`
    fragment AuctionResultsRail_me on Me {
      auctionResultsByFollowedArtists(first: 3) {
        totalCount
        edges {
          cursor
          node {
            ...AuctionResultListItem_auctionResult
            artistID
            internalID
          }
        }
      }
    }
  `,
})

export const tracks = {
  tappedHeader: () => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.auctionResultsForArtistsYouFollow,
    type: "header",
  }),

  tappedThumbnail: (auctionResultId: string, position: number) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionResultId,
    horizontal_slide_position: position,
    type: "thumbnail",
  }),
}
