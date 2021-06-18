import { AuctionResultsRail_me } from "__generated__/AuctionResultsRail_me.graphql"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { AuctionResultForYouListItem } from "lib/Scenes/AuctionResultForYou/AuctionResultForYouListItem"
import { Flex } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { RailScrollProps } from "./types"

const AuctionResultsRail: React.FC<{ me: AuctionResultsRail_me } & RailScrollProps> = (props) => {
  const { me, scrollRef } = props
  const { auctionResultsByFollowedArtists } = me
  const listRef = useRef<FlatList<any>>()
  const navigateToAuctionResultsForYou = () => {
    // uncomment after implementing AuctionResults query
    // const tapEvent = HomeAnalytics.collectionThumbnailTapEvent(result?.slug, index)
    // if (tapEvent) {
    //   tracking.trackEvent(tapEvent)
    // }
    navigate(`/auction-result-for-you`)
    // Here the auction-highlights is mocked slug for the navigation to work
    // ToDo: Refactor this part
    // navigate(`/auction-result-for-you/${result.slug}`)
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
        data={auctionResultsByFollowedArtists?.edges}
        keyExtractor={(_, index) => String(index)}
        horizontal={false}
        initialNumToRender={3}
        renderItem={({ item, index }) => {
          if (index >= 3) {
            return <></>
          }

          return <AuctionResultForYouListItem auctionResult={item?.node} />
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
            id
            artistID
            artist {
              name
            }
            internalID
            title
            currency
            dateText
            mediumText
            saleDate
            organization
            boughtIn
            priceRealized {
              cents
              display
            }
            performance {
              mid
            }
            images {
              thumbnail {
                url
              }
            }
          }
        }
      }
    }
  `,
})
