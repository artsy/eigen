import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { Box, Flex, NoArtworkIcon, Separator, Spacer, Text } from "palette"
import React from "react"
import { FlatList, Image, TouchableOpacity } from "react-native"

export const ArtistInsights = () => {
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
          data={[{ a: 1 }, { a: 2 }]}
          renderItem={({ item }) => (
            <Flex height={100} py="2" flexDirection="row">
              {true ? (
                <Flex width={60} height={60} backgroundColor="black10" alignItems="center" justifyContent="center">
                  <NoArtworkIcon width={28} height={28} opacity={0.3} />
                </Flex>
              ) : (
                <Image style={{ width: 60, height: 60 }} />
              )}
              <Flex ml={15}>
                <Text variant="title">Untitled, 2015</Text>
                <Flex flex={1} />
                <Text variant="small" color="black60">
                  Pastel on paper
                </Text>
                <Text variant="small" color="black60">
                  Feb 13, 2019 (dot) Sotheby's
                </Text>
              </Flex>
              <Flex flex={1} />
              <Flex>
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
