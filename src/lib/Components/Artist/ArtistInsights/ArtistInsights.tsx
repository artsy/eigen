import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { formatCentsToDollars } from "lib/Scenes/MyCollection/utils/formatCentsToDollars"
import { extractNodes } from "lib/utils/extractNodes"
import { capitalize } from "lodash"
import moment from "moment"
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

  const now = moment()

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
          renderItem={({ item }) => {
            const awaitingResults = moment(item.saleDate).isAfter(now)
            const ratio = item.priceRealized?.cents / item.estimate?.low
            const ratioColor = (() => {
              if (ratio >= 1.05) {
                return "green100"
              }
              if (ratio >= 0.95) {
                return "black60"
              }
              return "red100"
            })()

            return (
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
                  <Text variant="small" color="black60" numberOfLines={1}>
                    {capitalize(item.mediumText)}
                  </Text>
                  <Text variant="small" color="black60" numberOfLines={1}>
                    {moment(item.saleDate).format("MMM D, YYYY")}
                    {` ${bullet} `}
                    {item.organization}
                  </Text>
                </Flex>
                <Flex>
                  {item.priceRealized !== null ? (
                    <Flex alignItems="flex-end">
                      <Text variant="mediumText">
                        {(item.priceRealized?.display ?? "").replace(`${item.currency} `, "")}
                      </Text>
                      <Flex borderRadius={2} overflow="hidden">
                        <Flex
                          position="absolute"
                          width="100%"
                          height="100%"
                          backgroundColor={ratioColor}
                          opacity={0.05}
                        />
                        <Text variant="mediumText" color={ratioColor} px={5}>
                          {ratio.toFixed(2)}x
                        </Text>
                      </Flex>
                    </Flex>
                  ) : (
                    <Text variant="mediumText">{awaitingResults ? "Awaiting results" : "Not available"}</Text>
                  )}
                </Flex>
              </Flex>
            )
          }}
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
      name
      auctionResultsConnection(first: 10, sort: DATE_DESC) {
        edges {
          node {
            id
            title
            dateText
            mediumText
            saleDate
            organization
            currency
            priceRealized {
              display
              cents
            }
            estimate {
              low
            }
          }
        }
      }
    }
  `,
})
