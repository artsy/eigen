import { Sans, Spacer } from "@artsy/palette"
import { PartnerShowsRail_partner } from "__generated__/PartnerShowsRail_partner.graphql"
import { isCloseToEdge } from "lib/utils/isCloseToEdge"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { PartnerShowRailItemContainer as RailItem } from "./PartnerShowRailItem"

const PAGE_SIZE = 6

const PartnerShowsRail: React.FC<{
  partner: PartnerShowsRail_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const currentAndUpcomingShows = partner.currentAndUpcomingShows && partner.currentAndUpcomingShows.edges

  const fetchNextPage = () => {
    if (fetchingNextPage) {
      return
    }
    setFetchingNextPage(true)
    relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("PartnerShows.tsx", error.message)
      }
      setFetchingNextPage(false)
    })
  }

  return (
    <>
      {!!currentAndUpcomingShows &&
        !!currentAndUpcomingShows.length && (
          <>
            <Sans size="3t" weight="medium">
              Current and upcoming shows
            </Sans>
            <FlatList
              horizontal
              onScroll={isCloseToEdge(fetchNextPage)}
              data={currentAndUpcomingShows}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.node.id}
              renderItem={({ item }) => {
                return <RailItem show={item.node} />
              }}
            />
            <Spacer mb={2} />
          </>
        )}
    </>
  )
}

export const PartnerShowsRailContainer = createPaginationContainer(
  PartnerShowsRail,
  {
    partner: graphql`
      fragment PartnerShowsRail_partner on Partner
        @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        internalID
        currentAndUpcomingShows: showsConnection(status: CURRENT, sort: END_AT_ASC, first: $count, after: $cursor)
          @connection(key: "Partner_currentAndUpcomingShows") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              internalID
              slug
              name
              exhibitionPeriod
              endAt
              images {
                url
              }
              partner {
                ... on Partner {
                  name
                }
              }

              ...PartnerShowRailItem_show
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.partner && props.partner.currentAndUpcomingShows
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerShowsRailQuery($id: String!, $cursor: String, $count: Int!) {
        partner(id: $id) {
          ...PartnerShowsRail_partner @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
