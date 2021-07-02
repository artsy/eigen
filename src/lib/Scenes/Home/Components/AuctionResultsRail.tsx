import { ContextModule, OwnerType } from "@artsy/cohesion"
import { AuctionResultsRail_me } from "__generated__/AuctionResultsRail_me.graphql"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Separator } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { RailScrollProps } from "./types"

const AuctionResultsRail: React.FC<{ me: AuctionResultsRail_me } & RailScrollProps> = (props) => {
  const { me, scrollRef } = props
  const { trackEvent } = useTracking()
  const auctionResultsByFollowedArtists = extractNodes(me?.auctionResultsByFollowedArtists)
  const listRef = useRef<FlatList<any>>()
  const navigateToAuctionResultsForYou = () => {
    trackEvent(tracks.AuctionResultsRailHeaderTapEvent())
    navigate(`/auction-results-for-you`)
  }

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  return (
    <View>
      <Flex pl="2" pr="2">
        <SectionTitle title="Auction Results for You" onPress={navigateToAuctionResultsForYou} />
      </Flex>

      <CardRailFlatList
        listRef={listRef}
        data={auctionResultsByFollowedArtists}
        keyExtractor={(_, index) => String(index)}
        horizontal={false}
        initialNumToRender={3}
        ItemSeparatorComponent={() => (
          <Flex px={2}>
            <Separator borderColor={"black5"} />
          </Flex>
        )}
        renderItem={({ item, index }) => {
          if (!item) {
            return <></>
          }

          return (
            <AuctionResultFragmentContainer
              auctionResult={item}
              onPress={() => {
                trackEvent(tracks.AuctionResultsRailThumbnailTapEvent(index))
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
  AuctionResultsRailHeaderTapEvent: () => ({
    contextModule: ContextModule.auctionResultsRail,
    contextScreenOwnerType: OwnerType.home,
    destinationScreenOwnerType: OwnerType.auctionResultsRail,
    type: "header",
  }),

  AuctionResultsRailThumbnailTapEvent: (index?: number) => ({
    contextModule: ContextModule.auctionResultsRail,
    contextScreenOwnerType: OwnerType.home,
    destinationScreenOwnerType: OwnerType.auctionResultsRail,
    horizontalSlidePosition: index,
    type: "thumbnail",
  }),
}
