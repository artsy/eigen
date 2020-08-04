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
import { LOT_STANDINGS, PROPS, saleTime } from "lib/Scenes/MyBids/helpers"

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
