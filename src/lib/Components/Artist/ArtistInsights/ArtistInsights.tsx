import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, bullet, Flex, NoArtworkIcon, Separator, space, Text } from "palette"
import React from "react"
import { FlatList, Image, Text as RNText, TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist
}

export const ArtistInsights = (props: ArtistInsightsProps) => {
  const auctionResults = extractNodes(props.artist?.auctionResultsConnection)

  const MarketStats = () => (
    <>
      {/* Market Stats Hint */}
      <Flex flexDirection="row" alignItems="center">
        <Text variant="title" mr={5}>
          Market Stats
        </Text>
        <TouchableOpacity hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Image source={require("@images/info.png")} />
        </TouchableOpacity>
      </Flex>
      <Text variant="small" color="black60">
        Last 12 months
      </Text>
      {/* Market Stats Values */}
      <Flex flexDirection="row" flexWrap="wrap" mt={15}>
        <Flex width="50%">
          <Text variant="text">Average sale price</Text>
          <Text variant="largeTitle">$168k</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="text">Total lots sold</Text>
          <Text variant="largeTitle">61</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="text">Realized / estimate</Text>
          <Text variant="largeTitle">2.12x</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="text">Sell-through rate</Text>
          <Text variant="largeTitle">90%</Text>
        </Flex>
      </Flex>
    </>
  )

  return (
    <StickyTabPageScrollView paddingHorizontal={0}>
      <Box my="2" mx="2">
        <MarketStats />
      </Box>
      <Separator />
      <Box my="2" mx="2">
        <FlatList
          data={auctionResults}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <Flex height={100} py="2" flexDirection="row">
              {true ? (
                <Flex width={60} height={60} backgroundColor="black10" alignItems="center" justifyContent="center">
                  <NoArtworkIcon width={28} height={28} opacity={0.3} />
                </Flex>
              ) : (
                <Image style={{ width: 60, height: 60 }} />
              )}
              <Flex mx={15} flex={1}>
                <Flex flexDirection="row">
                  <Text variant="title" numberOfLines={1} style={{ flexShrink: 1 }}>
                    {item.title}
                  </Text>
                  <Text variant="title" numberOfLines={1}>
                    , {item.dateText}
                  </Text>
                </Flex>
                <Flex flex={1} backgroundColor="pink" />
                <Text variant="small" color="black60">
                  {item.mediumText}
                </Text>
                <Text variant="small" color="black60">
                  Feb 13, 2019
                  {` ${bullet} `}
                  {item.organization}
                </Text>
              </Flex>
              <Flex backgroundColor="orange">
                <Text variant="mediumText">$500,000</Text>
              </Flex>
            </Flex>
          )}
          ListHeaderComponent={() => (
            <>
              <Text variant="title">Auction Results</Text>
              <Text variant="small" color="black60">
                Sorted by most recent sale date
              </Text>
              <Separator mt="2" />
            </>
          )}
          ItemSeparatorComponent={() => <Separator />}
        />
      </Box>
    </StickyTabPageScrollView>
  )
}

export const ArtistInsightsFragmentContainer = createFragmentContainer(ArtistInsights, {
  artist: graphql`
    fragment ArtistInsights_artist on Artist {
      auctionResultsConnection(first: 10, sort: DATE_DESC) {
        edges {
          node {
            id
            title
            dateText
            mediumText
            organization
          }
        }
      }
    }
  `,
})
