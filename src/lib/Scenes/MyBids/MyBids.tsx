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
import { isSmallScreen } from "lib/Scenes/MyBids/helpers/screenDimensions"
import { extractNodes } from "lib/utils/extractNodes"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import moment from "moment-timezone"
import { MyBidsPlaceholder, SaleCardFragmentContainer } from "./Components"
import { LotStatusListItemContainer } from "./Components/LotStatusListItem"
import { NoBids } from "./Components/NoBids"
import { TimelySale } from "./helpers/timely"

export interface MyBidsProps {
  me: MyBids_me
  isActiveTab: boolean
  relay: RelayPaginationProp
}

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

  const watchedLots = extractNodes(me?.watchedLotConnection)
  const lotStandings = extractNodes(me?.auctionsLotStandingConnection)
  const registeredSales: Sale[] = me.bidders?.map((b) => b!.sale!) || []

  const { ActiveLotStandingsBySaleId, activeSales: sales, closedStandings } = sortLotsAndSales(
    watchedLots,
    lotStandings,
    registeredSales
  )

  const hasClosedBids = closedStandings.length > 0
  const hasActiveSales = sales.length > 0

  const somethingToShow = hasClosedBids || hasActiveSales

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
        {!!hasActiveSales && <BidTitle>Active Bids</BidTitle>}
        {!!hasActiveSales && (
          <Flex data-test-id="active-section">
            <Join separator={<Spacer my="1" />}>
              {sales.map((sale) => {
                const sortedActiveLotStandings = ActiveLotStandingsBySaleId[sale.internalID] || []
                const showNoBids = !sortedActiveLotStandings.length && !!sale.registrationStatus?.qualifiedForBidding
                return (
                  <SaleCardFragmentContainer
                    key={sale.internalID}
                    sale={sale}
                    me={me}
                    smallScreen={isSmallScreen}
                    hideChildren={!showNoBids && !sortedActiveLotStandings.length}
                  >
                    <Join separator={<Separator my="1" />}>
                      {!!showNoBids && (
                        <Text color="black60" py="1" textAlign="center">
                          You haven't placed any bids on this sale
                        </Text>
                      )}
                      {sortedActiveLotStandings.map((lot) => {
                        // this check performs type narrowing (from Lot | LotStanding)
                        if ("isHighestBidder" in lot) {
                          return <LotStatusListItemContainer key={lot.lot.internalID} lotStanding={lot} lot={null} />
                        } else {
                          return <LotStatusListItemContainer key={lot.lot.internalID} lot={lot} lotStanding={null} />
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
            <Flex mt="2" px="1.5">
              <Join separator={<Separator my="2" />}>
                {closedStandings?.map((lotStanding) => {
                  return (
                    <LotStatusListItemContainer
                      saleIsClosed
                      lotStanding={lotStanding}
                      lot={null}
                      key={lotStanding?.lot?.internalID}
                    />
                  )
                })}
              </Join>
            </Flex>
          </Flex>
        )}
        <Spacer my="2" />
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const BidTitle: React.FC<{ topBorder?: boolean }> = (props) => (
  <Flex bg="white100">
    <Text variant="subtitle" mx="1.5" my="2">
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
              isHighestBidder
              ...LotStatusListItem_lotStanding
              lot {
                internalID
                saleId
                soldStatus
              }
              saleArtwork {
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
              ...LotStatusListItem_lot
              lot {
                internalID
              }
              saleArtwork {
                internalID
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

type Sale = NonNullable<NonNullable<NonNullable<MyBids_me["bidders"]>[0]>["sale"]>
type LotStanding = NonNullable<
  NonNullable<NonNullable<NonNullable<MyBids_me["auctionsLotStandingConnection"]>["edges"]>[number]>["node"]
>
type WatchedLot = NonNullable<
  NonNullable<NonNullable<NonNullable<MyBids_me["watchedLotConnection"]>["edges"]>[number]>["node"]
>
type LotLike = LotStanding | WatchedLot
type SortData = (
  watchedLots: WatchedLot[],
  lotStandings: LotStanding[],
  registeredSales: Sale[]
) => {
  ActiveLotStandingsBySaleId: { [saleId: string]: LotLike[] }
  activeSales: Sale[]
  closedStandings: LotStanding[]
}

/**
 * This function provides the sorting and ordering logic for our watched lots, lot standings and registered sales.
 */
const sortLotsAndSales: SortData = (watchedLots, lotStandings, registeredSales) => {
  // separate active standings from closed standings
  const [activeStandings, closedStandings] = partition(
    lotStandings,
    (ls) => !TimelySale.create(ls?.saleArtwork?.sale!).isClosed
  )

  // combine unique watched lots with active standings => `ActiveLotStandings`
  const ActiveLotStandings = watchedLots.reduce(
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
  const activeBySaleId = groupBy(ActiveLotStandings, (ls) => ls?.saleArtwork?.sale?.internalID)

  // fetch unique sales from all active lots
  const salesFromLots = ActiveLotStandings.reduce((acc: Array<{ internalID: string }>, lot) => {
    return !!acc.find((sale: { internalID: string }) => sale.internalID === lot.saleArtwork.sale.internalID)
      ? acc
      : [...acc, lot.saleArtwork.sale]
  }, [])

  // Combine all unique sales from registrations and active lots
  const allSales = registeredSales.reduce((acc, sale) => {
    if (!acc.find((existingSale: { internalID: string }) => existingSale.internalID === sale.internalID)) {
      return [...acc, sale]
    } else {
      return acc
    }
  }, salesFromLots)

  // sort each group of lot standings by position (lot number)
  // The values of this object are displayed to the user under each sale card
  const ActiveLotStandingsBySaleId = mapValues(activeBySaleId, (lss) => sortBy(lss, (ls) => ls?.saleArtwork?.position!))

  // sort all sales by their relevant end time
  const activeSales = sortBy(allSales, (sale) => {
    const timelySale = TimelySale.create(sale)
    return moment(timelySale.relevantEnd).unix()
  })

  return {
    ActiveLotStandingsBySaleId,
    activeSales,
    closedStandings,
  }
}
