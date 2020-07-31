import {
  CheckCircleFillIcon,
  ChevronIcon,
  color,
  Flex,
  Separator,
  Spacer,
  Text,
  TimerIcon,
  XCircleIcon,
} from "@artsy/palette"
import React from "react"
import { FlatList, TouchableHighlight, View } from "react-native"
import styled from "styled-components/native"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"

const LOT_STANDINGS = [
  {
    isHighestBidder: true,
    isLeadingBidder: true,
    sale: {
      liveStartAt: "2020-07-27T14:55:00+00:00",
      endAt: "2020-07-27T14:55:54+00:00",
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYxZWVhMThlZTBmZDkwMDA2MTRiMjIw",
      lotLabel: "3",
      counts: {
        bidderPositions: 1,
      },
      currentBid: {
        display: "CHF 950",
      },
      artwork: {
        slug: "leo-jansen-untitled",
        artistNames: "Leo Jansen",
        href: "/artwork/leo-jansen-untitled",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/GEShb3U9PruEueZ732WYlw/medium.jpg",
        },
      },
    },
  },
  {
    isHighestBidder: false,
    isLeadingBidder: false,
    sale: {
      liveStartAt: "2020-07-27T14:55:00+00:00",
      endAt: "2020-07-27T14:55:54+00:00",
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYxZWVhMTdlZTBmZDkwMDA2MTRiMjE4",
      lotLabel: "2",
      counts: {
        bidderPositions: 2,
      },
      currentBid: {
        display: "CHF 18,000",
      },
      artwork: {
        slug: "blazo-kovacevic-painting",
        artistNames: "Blazo Kovacevic",
        href: "/artwork/blazo-kovacevic-painting",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/NyWl4Lhcj88ImL8vUMWTLw/medium.jpg",
        },
      },
    },
  },
  {
    isHighestBidder: true,
    isLeadingBidder: true,
    sale: {
      liveStartAt: "2020-07-27T14:55:00+00:00",
      endAt: "2020-07-27T14:55:54+00:00",
    },
    saleArtwork: {
      id: "U2FsZUFydHdvcms6NWYxZWVhMTVlZTBmZDkwMDA2MTRiMjEw",
      lotLabel: "1",
      counts: {
        bidderPositions: 1,
      },
      currentBid: {
        display: "CHF 450",
      },
      artwork: {
        slug: "rodrigo-zamora-painting",
        artistNames: "Rodrigo Zamora",
        href: "/artwork/rodrigo-zamora-painting",
        image: {
          url: "https://d2v80f5yrouhh2.cloudfront.net/bih3YROhPBXPHecFApJ4Jw/medium.jpg",
        },
      },
    },
  },
]

const REGISTERED_SALES = [
  {
    node: {
      endAt: "2020-07-28T17:00:00+00:00",
      liveStartAt: null,
      timeZone: "America/New_York",
      name: "RoGallery: A Curated Summer Sale",
      slug: "rogallery-a-curated-summer-sale",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/gNH3Jqo7shTMj2fPuoHBRg/square.jpg",
      },
      partner: {
        name: "RoGallery Auctions",
      },
    },
  },
  {
    node: {
      endAt: null,
      liveStartAt: "2020-07-30T16:00:00+00:00",
      timeZone: "America/Chicago",
      name: "Wright: Art + Design",
      slug: "wright-art-plus-design-13",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/oatfVx6L7sj2DSEPBtt8PQ/large_rectangle.jpg",
      },
      partner: {
        name: "Rago/Wright",
      },
    },
  },
  {
    node: {
      endAt: "2020-07-29T16:00:00+00:00",
      liveStartAt: null,
      timeZone: "America/New_York",
      name: "Artsy x Capsule Auctions: Collection Refresh III",
      slug: "artsy-x-capsule-auctions-collection-refresh-iii",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/XPuUTGDL_z7mypji_tv39Q/wide.jpg",
      },
      partner: {
        name: "Artsy x Capsule Auctions",
      },
    },
  },
  {
    node: {
      endAt: null,
      liveStartAt: "2020-08-05T15:00:00+00:00",
      timeZone: "America/Chicago",
      name: "Heritage: Urban Art Summer Skate",
      slug: "heritage-urban-art-summer-skate",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/JOeiPjbfKixGJbQjQHubXA/source.jpg",
      },
      partner: {
        name: "Heritage Auctions",
      },
    },
  },
  {
    node: {
      endAt: "2020-07-30T21:00:00+00:00",
      liveStartAt: null,
      timeZone: "America/New_York",
      name: "LongHouse Shares: Benefit Auction 2020",
      slug: "longhouse-shares-benefit-auction-2020",
      coverImage: {
        url: "https://d32dm0rphc51dk.cloudfront.net/TiJguopz8SwkypYEBH1TJw/source.jpg",
      },
      partner: {
        name: "LongHouse Reserve Benefit Auction",
      },
    },
  },
]

const CARD_WIDTH = 330
const CARD_HEIGHT = 140

const CardRailCard = styled.TouchableHighlight.attrs({ underlayColor: "transparent" })`
  width: ${CARD_WIDTH}px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
`

class LotRow extends React.Component {
  render() {
    const lot: typeof LOT_STANDINGS[0] = this.props.lot

    return (
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        onPress={() => SwitchBoard.presentNavigationViewController(this, lot.saleArtwork.artwork.href)}
      >
        <View>
          <Flex my="1" flexDirection="row">
            <Flex mr="1">
              <OpaqueImageView width={60} height={60} imageURL={lot.saleArtwork.artwork.image.url} />
            </Flex>

            <Flex flexGrow={1}>
              <Text variant="caption">{lot.saleArtwork.artwork.artistNames}</Text>
              <Text variant="caption">Lot {lot.saleArtwork.lotLabel}</Text>
              <Text variant="caption" color="black60">
                Opens in 22 minutes
              </Text>
            </Flex>

            <Flex flexGrow={1} alignItems="flex-end">
              <Flex flexDirection="row">
                <Text variant="caption">{lot.saleArtwork.currentBid.display}</Text>
                <Text variant="caption" color="black60">
                  {" "}
                  ({lot.saleArtwork.counts.bidderPositions}{" "}
                  {lot.saleArtwork.counts.bidderPositions === 1 ? "bid" : "bids"})
                </Text>
              </Flex>
              <Flex flexDirection="row" alignItems="center">
                {lot.isHighestBidder ? (
                  <>
                    <CheckCircleFillIcon fill="green100" />
                    <Text variant="caption"> Highest Bid</Text>
                  </>
                ) : (
                  <>
                    <XCircleIcon fill="red100" />
                    <Text variant="caption"> Outbid</Text>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>

          <Separator my="1" />
        </View>
      </TouchableHighlight>
    )
  }
}

export const MyBids = () => (
  <Flex flex={1}>
    <StickyTabPage
      staticHeaderContent={
        <Flex mt={2}>
          <Text variant="mediumText" textAlign="center">
            My Bids
          </Text>
        </Flex>
      }
      tabs={[
        {
          title: "Upcoming",
          content: (
            <StickyTabPageScrollView style={{ paddingHorizontal: 0 }}>
              <Flex mt="2" mb="1" mx="2">
                <Text variant="subtitle">Registered Sales</Text>
              </Flex>

              <FlatList
                horizontal
                ListHeaderComponent={() => <Spacer mr={2} />}
                ListFooterComponent={() => <Spacer mr={2} />}
                ItemSeparatorComponent={() => <Spacer width={15} />}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                windowSize={3}
                data={REGISTERED_SALES}
                keyExtractor={({ node }) => node.slug}
                renderItem={({ item }) => (
                  <CardRailCard key={item.node.slug}>
                    <View>
                      <OpaqueImageView width={CARD_WIDTH} height={CARD_HEIGHT} imageURL={item.node.coverImage.url} />

                      <Flex style={{ margin: 15 }}>
                        {!!item.node.partner?.name && (
                          <Text variant="small" color="black60">
                            {item.node.partner.name}
                          </Text>
                        )}
                        <Text variant="title">{item.node.name}</Text>

                        <Flex style={{ marginTop: 15 }} flexDirection="row">
                          <TimerIcon fill="black60" />

                          <Flex style={{ marginLeft: 5 }}>
                            <Text variant="caption">Live sale opens today at 5:00pm</Text>
                            <Text variant="caption" color="black60">
                              Starting in 44 minutes
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </View>
                  </CardRailCard>
                )}
              />

              <Flex m="2">
                <Text variant="subtitle">Your lots</Text>

                <Spacer mb={1} />

                {LOT_STANDINGS.map((lot, index) => (
                  <LotRow lot={lot} key={index} />
                ))}

                <Flex pt="1" pb="2" flexDirection="row" alignItems="center">
                  <Flex flexGrow={1}>
                    <Text variant="caption">View past bids</Text>
                  </Flex>

                  <Text variant="caption" color="black60">
                    30
                  </Text>

                  <ChevronIcon direction="right" fill="black60" />
                </Flex>

                <Separator mb="2" />
              </Flex>
            </StickyTabPageScrollView>
          ),
        },
        {
          title: "Recently Closed",
          content: (
            <StickyTabPageScrollView>
              <Flex mt={1}>
                {LOT_STANDINGS.map((lot, index) => (
                  <LotRow lot={lot} key={index} />
                ))}

                <Flex pt="1" pb="2" flexDirection="row" alignItems="center">
                  <Flex flexGrow={1}>
                    <Text variant="caption">View full history</Text>
                  </Flex>

                  <Text variant="caption" color="black60">
                    30
                  </Text>

                  <ChevronIcon direction="right" fill="black60" />
                </Flex>

                <Separator mb="2" />
              </Flex>
            </StickyTabPageScrollView>
          ),
        },
      ]}
    />
  </Flex>
)
