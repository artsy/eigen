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
import { capitalize } from "lodash"
import React from "react"
import { FlatList, TouchableHighlight, View } from "react-native"
import styled from "styled-components/native"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { saleTime } from "./helpers/saleTime"

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
      sale: {
        displayTimelyAt: "live 4d ago",
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
      sale: {
        displayTimelyAt: "live 4d ago",
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
      sale: {
        displayTimelyAt: "live 4d ago",
      },
    },
  },
]

export const REGISTERED_SALES = [
  {
    node: {
      href: "/auction/rogallery-a-curated-summer-sale",
      endAt: "2020-08-01T17:00:00+00:00",
      liveStartAt: null,
      displayTimelyAt: "ends in 3d",
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
      href: "/auction/wright-art-plus-design-13",
      endAt: null,
      liveStartAt: "2020-07-30T16:00:00+00:00",
      displayTimelyAt: "in progress",
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
      href: "/auction/artsy-x-capsule-auctions-collection-refresh-iii",
      endAt: "2020-07-29T16:00:00+00:00",
      liveStartAt: null,
      displayTimelyAt: "ends in 2d",
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
      href: "/auction/heritage-urban-art-summer-skate",
      endAt: null,
      liveStartAt: "2020-08-05T15:00:00+00:00",
      displayTimelyAt: "live in 5d",
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
      href: "/auction/longhouse-shares-benefit-auction-2020",
      endAt: "2020-07-30T21:00:00+00:00",
      liveStartAt: null,
      displayTimelyAt: "ends in 19h",
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

const PROPS = {
  upcomingLots: [...LOT_STANDINGS],
  recentlyClosedLots: [...LOT_STANDINGS],
  registeredSales: REGISTERED_SALES,
}

const CARD_WIDTH = 330
const CARD_HEIGHT = 140

const CardRailCard = styled.TouchableHighlight`
  width: ${CARD_WIDTH}px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
`

class Lot extends React.Component<{ lot: typeof LOT_STANDINGS[0] }> {
  render() {
    const { lot, children } = this.props

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
                {capitalize(lot.saleArtwork.sale.displayTimelyAt)}
              </Text>
            </Flex>

            <Flex flexGrow={1} alignItems="flex-end">
              {children}
            </Flex>
          </Flex>

          <Separator my="1" />
        </View>
      </TouchableHighlight>
    )
  }
}

const UpcomingLot = ({ lot }: { lot: typeof LOT_STANDINGS[0] }) => (
  <Lot lot={lot}>
    <Flex flexDirection="row">
      <Text variant="caption">{lot.saleArtwork.currentBid.display}</Text>
      <Text variant="caption" color="black60">
        {" "}
        ({lot.saleArtwork.counts.bidderPositions} {lot.saleArtwork.counts.bidderPositions === 1 ? "bid" : "bids"})
      </Text>
    </Flex>
    <Flex flexDirection="row" alignItems="center">
      {lot.isHighestBidder ? (
        <>
          <CheckCircleFillIcon fill="green100" />
          <Text variant="caption"> Highest Bid</Text>
        </>
      ) : lot.isLeadingBidder ? (
        <>
          <XCircleIcon fill="red100" />
          <Text variant="caption"> Reserve not met</Text>
        </>
      ) : (
        <>
          <XCircleIcon fill="red100" />
          <Text variant="caption"> Outbid</Text>
        </>
      )}
    </Flex>
  </Lot>
)

const RecentlyClosedLot = ({ lot }: { lot: typeof LOT_STANDINGS[0] }) => (
  <Lot lot={lot}>
    <Flex flexDirection="row">
      <Text variant="caption">{lot.saleArtwork.currentBid.display}</Text>
    </Flex>
    <Flex flexDirection="row" alignItems="center">
      {lot.isHighestBidder ? (
        <>
          <CheckCircleFillIcon fill="green100" />
          <Text variant="caption" color="green100">
            {" "}
            You won!
          </Text>
        </>
      ) : (
        <>
          <XCircleIcon fill="red100" />
          <Text variant="caption" color="red100">
            {" "}
            Didn't win
          </Text>
        </>
      )}
    </Flex>
  </Lot>
)

export class MyBids extends React.Component {
  render() {
    const { upcomingLots, recentlyClosedLots, registeredSales } = PROPS

    return (
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
              title: `Upcoming (${upcomingLots.length})`,
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
                    data={registeredSales.map(_ => _.node)}
                    keyExtractor={({ slug }) => slug}
                    renderItem={({ item }) => (
                      <CardRailCard
                        key={item.slug}
                        underlayColor="transparent"
                        activeOpacity={0.8}
                        onPress={() => SwitchBoard.presentNavigationViewController(this, item.href)}
                      >
                        <View>
                          <OpaqueImageView width={CARD_WIDTH} height={CARD_HEIGHT} imageURL={item.coverImage.url} />

                          <Flex style={{ margin: 15 }}>
                            {!!item.partner?.name && (
                              <Text variant="small" color="black60">
                                {item.partner.name}
                              </Text>
                            )}
                            <Text variant="title">{item.name}</Text>

                            <Flex style={{ marginTop: 15 }} flexDirection="row">
                              <TimerIcon fill="black60" />

                              <Flex style={{ marginLeft: 5 }}>
                                <Text variant="caption">{saleTime(item)}</Text>
                                <Text variant="caption" color="black60">
                                  {!!item.liveStartAt ? "Live Auction" : "Timed Auction"} •{" "}
                                  {capitalize(item.displayTimelyAt)}
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

                    {upcomingLots.map(lot => (
                      <UpcomingLot lot={lot} key={lot.saleArtwork.id} />
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
              title: `Recently Closed (${recentlyClosedLots.length})`,
              content: (
                <StickyTabPageScrollView>
                  <Flex mt={1}>
                    {recentlyClosedLots.map(lot => (
                      <RecentlyClosedLot lot={lot} key={lot.saleArtwork.id} />
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
  }
}
