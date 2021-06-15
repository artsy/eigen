import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { LinkText } from "lib/Components/Text/LinkText"
import { PAGE_SIZE } from "lib/data/constants"
import { Fonts } from "lib/data/fonts"
import { navigate } from "lib/navigation/navigate"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, Sans, Separator, Spinner, Text } from "palette"
import React, { useState } from "react"
import { SectionList } from "react-native"
import { Tab } from "../Favorites/Favorites"
import { AuctionResultForYouListItem } from "./AuctionResultForYouListItem"

export const AuctionResultForYou: React.FC = ({ me, relay }) => {
  const { hasMore, isLoading, loadMore } = relay
  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const auctionResultData = me.auctionResultsByFollowedArtists.edges

  const groupedAuctionResultData = groupBy(auctionResultData, (item) => moment(item.node.saleDate).format("MMM"))

  const groupedAuctionResultSectionData = Object.keys(groupedAuctionResultData).map((key) => {
    return { date: key, data: groupedAuctionResultData[key] }
  })

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    setLoadingMoreData(true)
    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setLoadingMoreData(false)
    })
  }

  return (
    <PageWithSimpleHeader title="Auction Results for You">
      <ArtworkFiltersStoreProvider>
        <Sans size="3" textAlign="left" color="black60" style={{ marginHorizontal: 20, marginVertical: 17 }}>
          The latest auction results for the {""}
          <LinkText onPress={() => navigate("/favorites", { passProps: { initialTab: Tab.artists } })}>
            artists you follow
          </LinkText>
          . You can also look up more auction results on the insights tab on any artist’s page.
        </Sans>
        <SectionList
          sections={groupedAuctionResultSectionData}
          onEndReachedThreshold={0.2}
          onEndReached={loadMoreArtworks}
          renderItem={({ item }) => (
            <AuctionResultForYouListItem
              auctionResult={item.node}
              onPress={() => {
                console.log("Pressed")
              }}
            />
          )} // Add onPress action after implementing AuctionResults Query
          renderSectionHeader={({ section: { date } }) => (
            <Text
              textAlign="left"
              color="black"
              style={{ fontFamily: Fonts.Unica77LLRegular, fontSize: 18, marginLeft: 20 }}
            >
              {date}
            </Text>
          )}
          ItemSeparatorComponent={() => (
            <Flex px={2}>
              <Separator />
            </Flex>
          )}
          style={{ width: useScreenDimensions().width }}
        />
      </ArtworkFiltersStoreProvider>
    </PageWithSimpleHeader>
  )
}
