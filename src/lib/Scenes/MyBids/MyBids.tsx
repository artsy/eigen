import { groupBy, mapValues, partition, sortBy } from "lodash"
import { Flex, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { RefreshControl, ScrollView } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

import { MyBids_me } from "__generated__/MyBids_me.graphql"
import { MyBidsQuery } from "__generated__/MyBidsQuery.graphql"

import { ActionType, OwnerType } from "@artsy/cohesion"
import { PAGE_SIZE } from "lib/data/constants"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { WatchedLotFragmentContainer as WatchedLot } from "lib/Scenes/MyBids/Components/WatchedLot"
import { isSmallScreen } from "lib/Scenes/MyBids/helpers/screenDimensions"
import { extractNodes } from "lib/utils/extractNodes"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import moment from "moment-timezone"
import {
  ActiveLotFragmentContainer as ActiveLot,
  ClosedLotFragmentContainer as ClosedLot,
  MyBidsPlaceholder,
  SaleCardFragmentContainer,
  // WatchedLotFragmentContainer as WatchedLot,
} from "./Components"
import { NoBids } from "./Components/NoBids"
import { isLotStandingComplete, TimelySale } from "./helpers/timely"

export interface MyBidsProps {
  me: MyBids_me
  isActiveTab: boolean
  relay: RelayPaginationProp
}

type Sale = NonNullable<NonNullable<NonNullable<MyBids_me["bidders"]>[0]>["sale"]>

const MyBids: React.FC<MyBidsProps> = (props) => {
  const [isFetching, setIsFetching] = React.useState<boolean>(false)
  const { relay, isActiveTab, me } = props

  const refreshMyBids = (withSpinner: boolean = false) => {
    if (!relay.isLoading()) {
      if (withSpinner) {
        setIsFetching(true)
      }
      relay.refetchConnection(PAGE_SIZE, (error) => {
        if (error) {
          console.error("MyBids/index.tsx #refreshMyBids", error.message)
          // FIXME: Handle error
        }
        setIsFetching(false)
      })
    }
  }

  React.useEffect(() => {
    if (isActiveTab) {
      refreshMyBids()
    }
  }, [isActiveTab])

  const lotStandings = extractNodes(me?.auctionsLotStandingConnection)
  const watchedLots = extractNodes(me?.watchedLotConnection)

  // separate active standings from closed standings
  const [activeStandings, closedStandings] = partition(
    lotStandings,
    (ls) => !TimelySale.create(ls?.saleArtwork?.sale!).isClosed
  )

  // combine unique watched lots with active standings => `activeLots`
  const activeLots = watchedLots.reduce(
    (acc: any[], watchedLot) => {
      if (!!activeStandings.find((existingLot) => existingLot!.lot!.internalID === watchedLot.lot.internalID)) {
        return acc
      } else {
        return [...acc, watchedLot]
      }
    },
    [...activeStandings]
  )

  // group active lots by sale id
  const activeBySaleId = groupBy(activeLots, (ls) => ls?.saleArtwork?.sale?.internalID)

  // sort an ordered list of sales by their relevant end time
  // TODO: add these to the allSales below (unique only)
  const registeredSales: Sale[] = me.bidders?.map((b) => b!.sale!) || []

  // fetch unique sales from all active lots
  const allSales = activeLots.reduce((acc: Array<{ internalID: string }>, lot) => {
    return !!acc.find((sale: { internalID: string }) => sale.internalID === lot.saleArtwork.sale.internalID)
      ? acc
      : [...acc, lot.saleArtwork.sale]
  }, [])

  // sort each group of lot standings by position (lot number)
  // The values of this object are displayed to the user under each sale card
  const sortedActiveLotsBySaleId = mapValues(activeBySaleId, (lss) => sortBy(lss, (ls) => ls?.saleArtwork?.position!))

  // sort all mentioned sales by their relevant end time
  const sortedSales = sortBy(allSales, (sale) => {
    const timelySale = TimelySale.create(sale)
    return moment(timelySale.relevantEnd).unix()
  })

  const hasActiveLots = activeLots.length > 0
  const hasClosedBids = closedStandings.length > 0
  const hasRegistrations = registeredSales.length > 0

  const somethingToShow = hasActiveLots || hasClosedBids || hasRegistrations

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={{
        action: ActionType.screen,
        context_screen_owner_type: OwnerType.inboxBids,
        // TODO: How to correctly pass the screen that was in view before the Inbox tab was tapped?
        // context_screen_referrer_type: ,
      }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: !somethingToShow ? "center" : "flex-start" }}
        stickyHeaderIndices={[0, 2]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refreshMyBids(true)
            }}
          />
        }
      >
        {!somethingToShow && <NoBids headerText="Discover works for you at auction." />}
        {!!hasRegistrations && <BidTitle>Active Bids</BidTitle>}
        {!!hasRegistrations && (
          <Flex data-test-id="active-section">
            <Join separator={<Spacer my={1} />}>
              {sortedSales.map((sale) => {
                const sortedActiveLots = sortedActiveLotsBySaleId[sale.internalID] || []
                // or check for the watched lots id which has a differ data shape
                const showNoBids = !sortedActiveLots.length && !!sale.registrationStatus?.qualifiedForBidding
                return (
                  <SaleCardFragmentContainer
                    key={sale.internalID}
                    sale={sale}
                    me={me}
                    smallScreen={isSmallScreen}
                    hideChildren={!showNoBids && !sortedActiveLots.length}
                  >
                    <Join separator={<Separator my={1} />}>
                      {!!showNoBids && (
                        <Text color="black60" py={1} textAlign="center">
                          You haven't placed any bids on this sale
                        </Text>
                      )}
                      {sortedActiveLots.map((lot) => {
                        // TODO: Once causality stitched to MP data errors are resolved we can bring this component back
                        // if (ls && arrayOfDedupedWatchedLotIDs.includes(ls?.lot?.internalID!)) {
                        //   return <WatchedLot lotStanding={ls} key={ls?.lot?.internalID!} />
                        // }
                        // Note: Occasionally, during live bidding, closed lots appear in active sales
                        if (lot && sale) {
                          return lot.__typename === "Lot" ? (
                            <WatchedLot lot={lot} key={lot?.lotState?.internalID} />
                          ) : isLotStandingComplete(lot) ? (
                            <ClosedLot inActiveSale lotStanding={lot} key={lot?.lot?.internalID} />
                          ) : (
                            <ActiveLot lotStanding={lot} key={lot?.lot?.internalID} />
                          )
                        }
                      })}
                    </Join>
                  </SaleCardFragmentContainer>
                )
              })}
            </Join>
          </Flex>
        )}
        {!!hasClosedBids && <BidTitle>Closed Bids</BidTitle>}
        {!!hasClosedBids && (
          <Flex data-test-id="closed-section">
            <Flex mt={2} px={1.5}>
              <Join separator={<Separator my={2} />}>
                {closedStandings?.map((ls) => {
                  return (
                    !!ls && (
                      <ClosedLot
                        withTimelyInfo
                        data-test-id="closed-sale-lot"
                        lotStanding={ls}
                        key={ls?.lot?.internalID}
                      />
                    )
                  )
                })}
              </Join>
            </Flex>
          </Flex>
        )}
        <Spacer my={2} />
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const BidTitle: React.FC<{ topBorder?: boolean }> = (props) => (
  <Flex bg="white100">
    <Text variant="subtitle" mx={1.5} my={2}>
      {props.children}
    </Text>
    <Separator />
  </Flex>
)

export const MyBidsContainer = createPaginationContainer(
  MyBids,
  {
    me: graphql`
      fragment MyBids_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 25 }, cursor: { type: "String", defaultValue: "" }) {
        ...SaleCard_me
        identityVerified
        bidders(active: true) {
          sale {
            internalID
            ...SaleCard_sale
            registrationStatus {
              qualifiedForBidding
            }
            internalID
            liveStartAt
            endAt
            status
          }
        }
        auctionsLotStandingConnection(first: $count, after: $cursor)
          @connection(key: "MyBids_auctionsLotStandingConnection") {
          edges {
            node {
              ...ActiveLot_lotStanding
              ...ClosedLot_lotStanding
              __typename
              lot {
                internalID
                saleId
                soldStatus
              }
              saleArtwork {
                artwork {
                  slug
                  internalID
                }
                position
                sale {
                  ...SaleCard_sale
                  internalID
                  liveStartAt
                  endAt
                  status
                }
              }
            }
          }
        }
        watchedLotConnection(first: 20, after: $cursor) {
          edges {
            node {
              ...WatchedLot_lot
              __typename
              lot {
                internalID
              }
              saleArtwork {
                internalID
                __id
                position
                sale {
                  ...SaleCard_sale
                  internalID
                  liveStartAt
                  endAt
                  status
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me && props.me.auctionsLotStandingConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyBidsPaginatedQuery($count: Int!, $cursor: String) {
        me {
          ...MyBids_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyBidsQueryRenderer: React.FC = () => (
  <QueryRenderer<MyBidsQuery>
    environment={defaultEnvironment}
    query={graphql`
      query MyBidsQuery {
        me {
          ...MyBids_me
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
