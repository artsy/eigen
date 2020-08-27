import { Flex, Join, Spacer, Text, TimerIcon } from "@artsy/palette"
import { capitalize, partition } from "lodash"
import React from "react"
import { TouchableHighlight } from "react-native"
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
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ActiveLot, MyBidsPlaceholder, RecentlyClosedLot } from "./Components"
import { CARD_HEIGHT } from "./shared"

export interface MyBidsProps {
  me: MyBids_me
  sales: MyBids_sales
}

class MyBids extends React.Component<MyBidsProps> {
  render() {
    const { me, sales } = this.props
    const lotStandings = me?.auctionsLotStandingConnection?.edges?.map(edge => edge?.node)

    const closedStati = ["Sold", "Passed"]
    const [recentlyClosedLots, activeLots] = partition(
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
              title: `Active`,
              content: (
                <StickyTabPageScrollView>
                  <Spacer my={1} />

                  <Join separator={<Spacer my={1} />}>
                    {sales?.edges?.map((edge?) => {
                      const node = edge?.node
                      const lotsInSale = activeLots.filter(ls => ls?.lotState?.saleId === node?.internalID)
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
                              lot => !!(lot && node) && <ActiveLot ls={lot} sale={node} key={lot?.saleArtwork?.id} />
                            )}
                          </Flex>
                        </React.Fragment>
                      )
                    })}
                  </Join>

                  <Spacer my={1} />
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
              askingPrice: onlineAskingPrice {
                displayAmount
              }
              sellingPrice: floorSellingPrice {
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
