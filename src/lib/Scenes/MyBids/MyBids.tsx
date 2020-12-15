import { groupBy, mapValues, partition, sortBy } from "lodash"
import { Flex, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { RefreshControl, ScrollView } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

import { MyBids_me } from "__generated__/MyBids_me.graphql"
import { MyBidsQuery } from "__generated__/MyBidsQuery.graphql"

import { OwnerType } from "@artsy/cohesion"
import { PAGE_SIZE } from "lib/data/constants"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { isSmallScreen } from "lib/Scenes/MyBids/helpers/screenDimensions"
import { extractNodes } from "lib/utils/extractNodes"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking } from "lib/utils/track"
import moment from "moment-timezone"
import {
  ActiveLotFragmentContainer as ActiveLot,
  ClosedLotFragmentContainer as ClosedLot,
  MyBidsPlaceholder,
  SaleCardFragmentContainer,
} from "./Components"
import { NoBids } from "./Components/NoBids"
import { isLotStandingComplete, TimelySale } from "./helpers/timely"

export interface MyBidsProps {
  me: MyBids_me
  relay: RelayPaginationProp
}

class MyBids extends React.Component<MyBidsProps> {
  state = {
    fetching: false,
  }
  refreshMyBids = (callback?: () => void) => {
    const { relay } = this.props
    if (!relay.isLoading()) {
      this.setState({ fetching: true })
      relay.refetchConnection(PAGE_SIZE, (error) => {
        if (error) {
          console.error("MyBids/index.tsx #refreshMyBids", error.message)
          // FIXME: Handle error
        }
        if (callback) {
          callback()
        }
        this.setState({ fetching: false })
      })
    } else {
      if (callback) {
        callback()
      }
    }
  }

  render() {
    const { me } = this.props
    const lotStandings = extractNodes(me?.auctionsLotStandingConnection)

    const [activeStandings, closedStandings] = partition(
      lotStandings.filter((ls) => !!ls),
      (ls) => !TimelySale.create(ls?.saleArtwork?.sale!).isClosed
    )

    // group active lot standings by sale id
    const activeBySaleId = groupBy(activeStandings, (ls) => ls?.saleArtwork?.sale?.internalID)

    // sort each group of lot standings by position (lot number)
    const sortedActiveLots = mapValues(activeBySaleId, (lss) => sortBy(lss, (ls) => ls?.saleArtwork?.position!))

    // sort an ordered list of sale ids by their relevant end time
    const sortedSaleIds: string[] = sortBy(Object.keys(sortedActiveLots), (saleId) => {
      const timelySale = TimelySale.create(sortedActiveLots[saleId][0]?.saleArtwork?.sale!)
      return moment(timelySale.relevantEnd).unix()
    })

    const noActiveBids = activeStandings.length === 0
    const noClosedBids = closedStandings.length === 0
    const noBids = noActiveBids && noClosedBids

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: !!noBids ? "center" : "flex-start" }}
        stickyHeaderIndices={[0, 2]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.fetching}
            onRefresh={() => {
              this.refreshMyBids()
            }}
          />
        }
      >
        {!!noBids && <NoBids headerText="Discover works for you at auction" />}
        {!noActiveBids && <BidTitle>Active Bids</BidTitle>}
        {!noActiveBids && (
          <Flex data-test-id="active-section">
            <Join separator={<Spacer my={1} />}>
              {sortedSaleIds.map((saleId) => {
                const activeLotStandings = sortedActiveLots[saleId]
                const sale = activeLotStandings[0]?.saleArtwork?.sale!
                return (
                  <SaleCardFragmentContainer key={saleId} sale={sale} me={me} smallScreen={isSmallScreen}>
                    <Join separator={<Separator my={1} />}>
                      {activeLotStandings.map((ls) => {
                        if (ls && sale) {
                          const LotInfoComponent = isLotStandingComplete(ls) ? ClosedLot : ActiveLot
                          return <LotInfoComponent lotStanding={ls as any} key={ls?.lotState?.internalID} />
                        }
                      })}
                    </Join>
                  </SaleCardFragmentContainer>
                )
              })}
            </Join>
          </Flex>
        )}
        {!noClosedBids && <BidTitle>Closed Bids</BidTitle>}
        {!noClosedBids && (
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
                        key={ls?.lotState?.internalID}
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
    )
  }
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
        auctionsLotStandingConnection(first: $count, after: $cursor)
          @connection(key: "MyBids_auctionsLotStandingConnection") {
          edges {
            node {
              ...ActiveLot_lotStanding
              ...ClosedLot_lotStanding
              lotState {
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
