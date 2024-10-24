import { Flex, Text } from "@artsy/palette-mobile"
import { PartnerShowsRail_partner$data } from "__generated__/PartnerShowsRail_partner.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { isCloseToEdge } from "app/utils/isCloseToEdge"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { PartnerShowRailItemContainer as RailItem } from "./PartnerShowRailItem"

const PAGE_SIZE = 6

const PartnerShowsRail: React.FC<{
  partner: PartnerShowsRail_partner$data
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const currentAndUpcomingShows = extractNodes(partner.currentAndUpcomingShows).filter(
    (show) => show.isDisplayable
  )

  const fetchNextPage = () => {
    if (fetchingNextPage) {
      return
    }
    setFetchingNextPage(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("PartnerShows.tsx", error.message)
      }
      setFetchingNextPage(false)
    })
  }

  if (!currentAndUpcomingShows?.length) {
    return null
  }

  return (
    <Flex mb={2}>
      <Text variant="sm-display">Current and upcoming shows</Text>
      <FlatList
        horizontal
        onScroll={isCloseToEdge(fetchNextPage)}
        data={currentAndUpcomingShows}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <RailItem show={item} />
        }}
      />
    </Flex>
  )
}

export const PartnerShowsRailContainer = createPaginationContainer(
  PartnerShowsRail,
  {
    partner: graphql`
      fragment PartnerShowsRail_partner on Partner
      @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        internalID
        currentAndUpcomingShows: showsConnection(
          status: CURRENT
          sort: END_AT_ASC
          first: $count
          after: $cursor
        ) @connection(key: "Partner_currentAndUpcomingShows") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              isDisplayable
              id
              internalID
              slug
              name
              exhibitionPeriod(format: SHORT)
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
    getConnectionFromProps(props) {
      return props.partner && props.partner.currentAndUpcomingShows
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
