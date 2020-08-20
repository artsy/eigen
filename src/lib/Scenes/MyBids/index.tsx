import { CheckCircleFillIcon, color, Flex, Join, Separator, Spacer, Text, TimerIcon, XCircleIcon } from "@artsy/palette"
import { capitalize, times } from "lodash"
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

type LotStanding = NonNullable<MyBids_me["lotStandings"]>[number]

export interface MyBidsProps {
  me: MyBids_me
  sales: MyBids_sales
}

class Lot extends React.Component<{ lot: LotStanding }> {
  render() {
    const { lot, children } = this.props

    return (
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        onPress={() => SwitchBoard.presentNavigationViewController(this, lot?.saleArtwork?.artwork?.href as string)}
      >
        <View>
          <Flex my="1" flexDirection="row">
            <Flex mr="1">
              <OpaqueImageView width={60} height={60} imageURL={lot?.saleArtwork?.artwork?.image?.url} />
            </Flex>

            <Flex flexGrow={1} flexShrink={1}>
              <Text variant="caption">{lot?.saleArtwork?.artwork?.artistNames}</Text>
              <Text variant="caption">Lot {lot?.saleArtwork?.lotLabel}</Text>
              <Text variant="caption" color="black60">
                {capitalize(lot?.sale?.displayTimelyAt as string)}
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

export const UpcomingLot = ({ lot }: { lot: LotStanding }) => (
  <Lot lot={lot}>
    <Flex flexDirection="row">
      <Text variant="caption">{lot?.saleArtwork?.currentBid?.display}</Text>
      <Text variant="caption" color="black60">
        {" "}
        ({lot?.saleArtwork?.counts?.bidderPositions} {lot?.saleArtwork?.counts?.bidderPositions === 1 ? "bid" : "bids"})
      </Text>
    </Flex>
    <Flex flexDirection="row" alignItems="center">
      {lot?.isHighestBidder ? (
        <>
          <CheckCircleFillIcon fill="green100" />
          <Text variant="caption"> Highest Bid</Text>
        </>
      ) : lot?.isLeadingBidder ? (
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

export const RecentlyClosedLot = ({ lot }: { lot: LotStanding }) => (
  <Lot lot={lot}>
    <Flex flexDirection="row">
      <Text variant="caption">{lot?.saleArtwork?.currentBid?.display}</Text>
    </Flex>
    <Flex flexDirection="row" alignItems="center">
      {lot?.isHighestBidder ? (
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

class MyBids extends React.Component<MyBidsProps> {
  render() {
    const { me, sales } = this.props
    // const upcomingLots = me?.lotStandings
    const recentlyClosedLots = me?.lotStandings

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

                      return (
                        <TouchableHighlight
                          key={node?.slug}
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
                    {recentlyClosedLots?.map(lot => (
                      <RecentlyClosedLot lot={lot} key={lot?.saleArtwork?.id} />
                    ))}
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
      lotStandings {
        isHighestBidder
        isLeadingBidder
        sale {
          displayTimelyAt
          liveStartAt
          endAt
        }
        saleArtwork {
          id
          lotLabel
          counts {
            bidderPositions
          }
          currentBid {
            display
          }
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
