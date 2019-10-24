import { Box, color, Flex, Sans, Serif, space, Spacer } from "@artsy/palette"
import { PartnerShows_partner } from "__generated__/PartnerShows_partner.graphql"
import { ShowItem } from "lib/Scenes/Show/Components/Shows/Components/ShowItem"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React, { useState } from "react"
import { FlatList, ImageBackground, ScrollView, TouchableWithoutFeedback } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

const PAGE_SIZE = 6

export const PartnerShows: React.FC<{
  partner: PartnerShows_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const currentAndUpcomingShows = partner.currentAndUpcomingShows && partner.currentAndUpcomingShows.edges
  const pastShows = partner.pastShows && partner.pastShows.edges

  const ShowGridItem = (node, itemIndex) => {
    const { show } = node
    const showImage = show.coverImage || ""
    const styles = itemIndex % 2 === 0 ? { paddingLeft: space(1) } : { paddingRight: space(1) }
    return (
      <GridItem>
        <TouchableWithoutFeedback onPress={null}>
          <Box style={styles}>
            {showImage ? (
              <BackgroundImage style={{ resizeMode: "cover" }} source={{ uri: showImage.url }} />
            ) : (
              <EmptyImage />
            )}
            <Spacer mb={0.5} />
            <Sans size="2">{show.name}</Sans>
            <Serif size="2">{show.exhibitionPeriod}</Serif>
          </Box>
        </TouchableWithoutFeedback>
        <Spacer mb={2} />
      </GridItem>
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
              <FlatList
                horizontal
                data={currentAndUpcomingShows}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.node.id}
                renderItem={({ item }) => {
                  return <ShowItem show={item.node as any} />
                }}
              />
            </>
          )}
        {pastShows &&
          pastShows.length && (
            <>
              <Sans size="3t" weight="medium">
                Past shows
              </Sans>
              <Spacer mb={2} />
              <Flex flexDirection="row" flexWrap="wrap">
                {pastShows.map((show, index) => {
                  const node = show.node
                  return <ShowGridItem itemIndex={index} key={node.id} show={node} />
                })}
              </Flex>
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

const BackgroundImage = styled(ImageBackground)`
  height: 120;
`

const GridItem = styled(Box)`
  width: 50%;
`

const EmptyImage = styled(Box)`
  height: 120;
  background-color: ${color("black30")};
`
