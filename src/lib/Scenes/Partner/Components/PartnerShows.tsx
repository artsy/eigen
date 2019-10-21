import { Box, Sans, Serif, Spacer } from "@artsy/palette"
import { PartnerShows_partner } from "__generated__/PartnerShows_partner.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ShowItem } from "lib/Scenes/Show/Components/Shows/Components/ShowItem"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React, { useState } from "react"
import { FlatList, ScrollView, TouchableWithoutFeedback } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

const PAGE_SIZE = 6

export const PartnerShows: React.FC<{
  partner: PartnerShows_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const currentAndUpcomingShows = partner.currentAndUpcomingShows && partner.currentAndUpcomingShows.edges
  const pastShows = partner.pastShows && partner.pastShows.edges

  const ShowGridItem = node => {
    const { show } = node
    console.log("show", show)
    const showImage = show.coverImage
    return (
      <TouchableWithoutFeedback onPress={null}>
        <>
          {showImage && <OpaqueImageView aspectRatio={showImage.aspectRatio} imageURL={showImage.url} />}
          <Spacer mb={2} />
          <Serif size="3">{show.name}</Serif>
          <Sans size="2">{show.exhibitionPeriod}</Sans>
        </>
      </TouchableWithoutFeedback>
    )
  }

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
    <ScrollView onScroll={isCloseToBottom(fetchNextPage)}>
      <Box px={2} py={3}>
        {currentAndUpcomingShows &&
          currentAndUpcomingShows.length && (
            <>
              <Sans size="3t" weight="medium">
                Current and upcoming shows
              </Sans>
              <Spacer mb={2} />
              <FlatList
                horizontal
                data={currentAndUpcomingShows}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.node.id}
                renderItem={({ item }) => {
                  return <ShowItem show={item.node as any} />
                }}
              />
              <Spacer mb={3} />
            </>
          )}
        {pastShows &&
          pastShows.length && (
            <>
              <Sans size="3t" weight="medium">
                Past shows
              </Sans>
              <Spacer mb={2} />
              {pastShows.map(show => {
                const node = show.node
                return <ShowGridItem key={node.id} show={node} />
              })}
              <Spacer mb={3} />
            </>
          )}
      </Box>
    </ScrollView>
  )
}

export const PartnerShowsFragmentContainer = createPaginationContainer(
  PartnerShows,
  {
    partner: graphql`
      fragment PartnerShows_partner on Partner
        @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        slug
        internalID
        currentAndUpcomingShows: showsConnection(sort: START_AT_ASC, first: 10) {
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

              ...ShowItem_show
            }
          }
        }
        pastShows: showsConnection(sort: END_AT_ASC, first: $count, after: $cursor)
          @connection(key: "Partner_pastShows") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              name
              slug
              exhibitionPeriod
              coverImage {
                url
                aspectRatio
              }
              href
              exhibitionPeriod
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.partner && props.partner.pastShows
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
      query PartnerShowsInfiniteScrollGridQuery($id: String!, $cursor: String, $count: Int!) {
        partner(id: $id) {
          ...PartnerShows_partner @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
