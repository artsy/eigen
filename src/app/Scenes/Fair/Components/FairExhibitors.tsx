import { FairExhibitors_fair$data } from "__generated__/FairExhibitors_fair.graphql"
import { FAIR2_EXHIBITORS_PAGE_SIZE } from "app/Components/constants"
import Spinner from "app/Components/Spinner"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Flex } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { FairExhibitorRailFragmentContainer } from "./FairExhibitorRail"

interface FairExhibitorsProps {
  fair: FairExhibitors_fair$data
  relay: RelayPaginationProp
}

const FairExhibitors: React.FC<FairExhibitorsProps> = ({ fair, relay }) => {
  const [isLoading, setIsLoading] = useState(false)

  const shows = extractNodes(fair?.exhibitors)

  const loadMoreExhibitors = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    setIsLoading(true)
    relay.loadMore(FAIR2_EXHIBITORS_PAGE_SIZE, (err) => {
      setIsLoading(false)

      if (err) {
        console.error(err)
      }
    })
  }

  return (
    <FlatList
      data={shows}
      renderItem={({ item: show }) => {
        if ((show?.counts?.artworks ?? 0) === 0 || !show?.partner) {
          // Skip rendering of booths without artworks
          return null
        }

        return (
          <Box key={show.id} mb={3}>
            <FairExhibitorRailFragmentContainer key={show.id} show={show} />
          </Box>
        )
      }}
      keyExtractor={(item) => String(item?.id)}
      onEndReached={loadMoreExhibitors}
      ListFooterComponent={
        isLoading ? (
          <Box p={2}>
            <Flex flex={1} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          </Box>
        ) : null
      }
    />
  )
}

export const FairExhibitorsFragmentContainer = createPaginationContainer(
  FairExhibitors,
  {
    fair: graphql`
      fragment FairExhibitors_fair on Fair
      @argumentDefinitions(first: { type: "Int", defaultValue: 30 }, after: { type: "String" }) {
        internalID
        slug
        exhibitors: showsConnection(first: $first, after: $after, sort: FEATURED_ASC)
          @connection(key: "FairExhibitorsQuery_exhibitors") {
          edges {
            node {
              id
              counts {
                artworks
              }
              partner {
                ... on Partner {
                  id
                }
                ... on ExternalPartner {
                  id
                }
              }
              ...FairExhibitorRail_show
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getVariables({ fair: { slug: id } }, { cursor: after }, { first }) {
      return { first, after, id }
    },
    query: graphql`
      query FairExhibitorsQuery($id: String!, $first: Int!, $after: String) {
        fair(id: $id) {
          ...FairExhibitors_fair @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)
