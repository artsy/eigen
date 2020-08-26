import { CheckCircleFillIcon, color, Flex, Join, Separator, Spacer, Text, TimerIcon, XCircleIcon } from "@artsy/palette"
import { capitalize, partition, times } from "lodash"
import React from "react"
import { TouchableHighlight, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { MyBids_me } from "__generated__/MyBids_me.graphql"
import { MyBids_sales } from "__generated__/MyBids_sales.graphql"
import { MyBidsQuery } from "__generated__/MyBidsQuery.graphql"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { saleTime } from "lib/Scenes/MyBids/helpers"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"

const CARD_HEIGHT = 72

type LotStanding = NonNullable<NonNullable<NonNullable<MyBids_me["auctionsLotStandingConnection"]>["edges"]>[0]>["node"]
type Sale = NonNullable<NonNullable<NonNullable<MyBids_sales["edges"]>[0]>["node"]>

export interface MyBidsProps {
  me: MyBids_me
  sales: MyBids_sales
}

class Lot extends React.Component<{ ls: LotStanding; sale?: Sale }> {
  render() {
    const { ls, sale, children } = this.props

    return (
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        onPress={() => SwitchBoard.presentNavigationViewController(this, ls?.saleArtwork?.artwork?.href as string)}
      >
        <View>
          <Flex my="1" flexDirection="row">
            <Flex mr="1">
              <OpaqueImageView width={60} height={60} imageURL={ls?.saleArtwork?.artwork?.image?.url} />
            </Flex>

            <Flex flexGrow={1} flexShrink={1}>
              <Text variant="caption">{ls?.saleArtwork?.artwork?.artistNames}</Text>
              <Text variant="caption">Lot {ls?.saleArtwork?.lotLabel}</Text>
              {!!sale && (
                <Text variant="caption" color="black60">
                  {capitalize(sale.displayTimelyAt as string)}
                </Text>
              )}
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

export const UpcomingLot = ({ ls, sale }: { ls: LotStanding; sale: Sale }) => {
  const sellingPrice = ls?.lotState?.floorSellingPrice?.displayAmount
  const bidCount = ls?.lotState?.bidCount
  return (
    <Lot ls={ls} sale={sale}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
        <Text variant="caption" color="black60">
          {" "}
          ({bidCount} {bidCount === 1 ? "bid" : "bids"})
        </Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        {ls?.isHighestBidder && ls.lotState.reserveStatus !== "ReserveNotMet" ? (
          <>
            <CheckCircleFillIcon fill="green100" />
            <Text variant="caption"> Highest Bid</Text>
          </>
        ) : ls?.isHighestBidder ? (
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
}

export const RecentlyClosedLot = ({ ls }: { ls: LotStanding }) => {
  const sellingPrice = ls?.lotState?.floorSellingPrice?.displayAmount
  return (
    <Lot ls={ls}>
      <Flex flexDirection="row">
        <Text variant="caption">{sellingPrice}</Text>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        {ls?.isHighestBidder && ls?.lotState.soldStatus === "Sold" ? (
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
}

class MyBids extends React.Component<MyBidsProps> {
  render() {
    const { me, sales } = this.props
    const lotStandings = me?.auctionsLotStandingConnection?.edges?.map(edge => edge?.node)

    const closedStati = ["Sold", "Passed"]
    const [recentlyClosedLots, upcomingLots] = partition(
      lotStandings,
      ls => ls?.lotState?.soldStatus && closedStati.includes(ls.lotState.soldStatus)
    )

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
              title: `Upcoming`,
              content: (
                <StickyTabPageScrollView>
                  <Spacer my={1} />

                  <Join separator={<Spacer my={1} />}>
                    {sales?.edges?.map((edge?) => {
                      const node = edge?.node
                      const lotsInSale = upcomingLots.filter(ls => ls?.lotState?.saleId === node?.internalID)
                      return (
                        <React.Fragment key={node?.slug}>
                          <TouchableHighlight
                            underlayColor="transparent"
                            activeOpacity={0.8}
                            onPress={() => SwitchBoard.presentNavigationViewController(this, node?.href as string)}
                          >
                            <Flex
                              overflow="hidden"
                              borderWidth={1}
                              borderStyle="solid"
                              borderColor="black10"
                              borderRadius={4}
                            >
                              <OpaqueImageView height={CARD_HEIGHT} imageURL={node?.coverImage?.url} />

                              <Flex style={{ margin: 15 }}>
                                {!!node?.partner?.name && (
                                  <Text variant="small" color="black60">
                                    {node?.partner.name}
                                  </Text>
                                )}
                                <Text variant="title">{node?.name}</Text>

                                <Flex style={{ marginTop: 15 }} flexDirection="row">
                                  <TimerIcon fill="black60" />

                                  <Flex style={{ marginLeft: 5 }}>
                                    <Text variant="caption">{saleTime(node)}</Text>
                                    <Text variant="caption" color="black60">
                                      {!!node?.liveStartAt ? "Live Auction" : "Timed Auction"} •{" "}
                                      {capitalize(node?.displayTimelyAt as string)}
                                    </Text>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Flex>
                          </TouchableHighlight>
                          <Flex m="2">
                            {lotsInSale?.map(
                              lot => !!(lot && node) && <UpcomingLot ls={lot} sale={node} key={lot?.saleArtwork?.id} />
                            )}
                          </Flex>
                        </React.Fragment>
                      )
                    })}
                  </Join>

                  <Spacer my={1} />

                  {/*<Flex m="2">*/}
                  {/*  {upcomingLots?.map((lot) => (*/}
                  {/*    <UpcomingLot lot={lot} key={lot?.saleArtwork?.id} />*/}
                  {/*  ))}*/}
                  {/*</Flex>*/}
                </StickyTabPageScrollView>
              ),
            },
            {
              title: `Recently Closed`,
              content: (
                <StickyTabPageScrollView>
                  <Flex mt={1}>
                    {recentlyClosedLots?.map(lot => !!lot && <RecentlyClosedLot ls={lot} key={lot?.saleArtwork?.id} />)}
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

const MyBidsPlaceholder: React.FC = () => (
  <Flex pt="3" px="1">
    {/* navbar title */}
    <Flex alignItems="center">
      <PlaceholderText width={100} />
    </Flex>

    {/* tabs */}
    <Flex flexDirection="row">
      <Flex flex={1} alignItems="center">
        <PlaceholderText marginTop={20} width={80} />
      </Flex>

      <Flex flex={1} alignItems="center">
        <PlaceholderText marginTop={20} width={80} />
      </Flex>
    </Flex>

    <Separator mt={1} mb={2} />

    {/* registered sales */}
    <Flex px="1">
      <PlaceholderText marginTop={5} marginBottom={20} width={100 + Math.random() * 100} />

      <Flex flexDirection="row" pb={2}>
        {times(3).map(index => (
          <Flex key={index} marginRight={2}>
            <PlaceholderBox height={CARD_HEIGHT} width="100%" />
            <PlaceholderText marginTop={10} width={40 + Math.random() * 80} />
            <PlaceholderText marginTop={5} width={40 + Math.random() * 80} />
          </Flex>
        ))}
      </Flex>
    </Flex>

    {/* your lots */}
    <Flex px="1">
      <PlaceholderText marginTop={10} width={80} />

      <Join separator={<Separator my={1} />}>
        {times(4).map(index => (
          <Flex mt={1} key={index} flexDirection="row">
            <PlaceholderBox height={60} width={60} />

            <Flex ml={1} flex={1}>
              <PlaceholderText width={50 + Math.random() * 80} />
              <PlaceholderText marginTop={5} width={50 + Math.random() * 80} />
              <PlaceholderText marginTop={5} width={50 + Math.random() * 80} />
            </Flex>

            <Flex flexGrow={1} alignItems="flex-end">
              <PlaceholderText width={30 + Math.random() * 80} />
              <PlaceholderText marginTop={5} width={30 + Math.random() * 80} />
            </Flex>
          </Flex>
        ))}
      </Join>
    </Flex>
  </Flex>
)

const MyBidsContainer = createFragmentContainer(MyBids, {
  sales: graphql`
    fragment MyBids_sales on SaleConnection {
      edges {
        node {
          internalID
          saleType
          href
          endAt
          liveStartAt
          displayTimelyAt
          timeZone
          name
          slug
          coverImage {
            url
          }
          partner {
            name
          }
        }
      }
    }
  `,
  me: graphql`
    fragment MyBids_me on Me {
      auctionsLotStandingConnection(first: 25) {
        edges {
          node {
            isHighestBidder
            lotState {
              saleId
              bidCount
              reserveStatus
              soldStatus
              onlineAskingPrice {
                displayAmount
              }
              floorSellingPrice {
                displayAmount
              }
            }
            saleArtwork {
              id
              lotLabel

              artwork {
                artistNames
                href
                image {
                  url(version: "medium")
                }
              }
            }
          }
        }
      }
    }
  `,
})

export const MyBidsQueryRenderer: React.FC = () => (
  <QueryRenderer<MyBidsQuery>
    environment={defaultEnvironment}
    query={graphql`
      query MyBidsQuery {
        me {
          ...MyBids_me
        }
        sales: salesConnection(first: 100, registered: true) {
          ...MyBids_sales
        }
      }
    `}
    render={renderWithPlaceholder({
      Container: MyBidsContainer,
      renderPlaceholder: () => <MyBidsPlaceholder />,
    })}
    variables={{}}
  />
)
