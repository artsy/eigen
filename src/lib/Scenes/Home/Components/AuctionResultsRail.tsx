import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { AuctionResultsRail_me } from "__generated__/AuctionResultsRail_me.graphql"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Separator } from "palette"
import React, { useEffect, useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

interface Props {
  onHide?: () => void
  onShow?: () => void
}

const AuctionResultsRail: React.FC<{ me: AuctionResultsRail_me } & RailScrollProps & Props> = (props) => {
  const { me, scrollRef, onHide, onShow } = props
  const { trackEvent } = useTracking()
  const auctionResultsByFollowedArtists = extractNodes(me?.auctionResultsByFollowedArtists)
  const listRef = useRef<FlatList<any>>()
  const navigateToAuctionResultsForArtistsYouFollow = () => {
    trackEvent(tracks.tappedHeader())
    navigate(`/auction-results-for-artists-you-follow`)
  }

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  // Checks to see if rail is being rendered and hides / shows the separator accordingly
  useEffect(() => {
    auctionResultsByFollowedArtists?.length ? onShow?.() : onHide?.()
  }, [auctionResultsByFollowedArtists])

  if (!auctionResultsByFollowedArtists?.length) {
    return null
  }

  return (
    <View>
      <Flex pl="2" pr="2">
        <SectionTitle
          title="Auction Results for Artists You Follow"
          onPress={navigateToAuctionResultsForArtistsYouFollow}
        />
      </Flex>

      <CardRailFlatList
        listRef={listRef}
        data={auctionResultsByFollowedArtists}
        keyExtractor={(_, index) => String(index)}
        horizontal={false}
        initialNumToRender={3}
        ItemSeparatorComponent={() => (
          <Flex px={2} py={2}>
            <Separator borderColor={"black10"} />
          </Flex>
        )}
        renderItem={({ item, index }) => {
          if (!item) {
            return <></>
          }

          return (
            <AuctionResultFragmentContainer
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
    </View>
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
