import { Box, color, Flex, Sans, Serif, space, Spacer } from "@artsy/palette"
import { PartnerShows_partner } from "__generated__/PartnerShows_partner.graphql"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React, { useState } from "react"
import { ImageBackground, ScrollView, TouchableWithoutFeedback } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { PartnerEmptyState } from "./PartnerEmptyState"
import { PartnerShowsRailContainer as PartnerShowsRail } from "./PartnerShowsRail"

const PAGE_SIZE = 6

const ShowGridItem = ({ show, itemIndex }) => {
  const showImage = show.coverImage || ""
  const styles = itemIndex % 2 === 0 ? { paddingRight: space(1) } : { paddingLeft: space(1) }
  return (
    <GridItem key={show.id}>
      <TouchableWithoutFeedback onPress={null}>
        <Box style={styles}>
          {showImage ? (
            <BackgroundImage key={show.id} style={{ resizeMode: "cover" }} source={{ uri: showImage.url }} />
          ) : (
            <EmptyImage />
          )}
          <Spacer mb={0.5} />
          <Sans size="2">{show.name}</Sans>
          <Serif size="2" color="black60">
            {show.exhibitionPeriod}
          </Serif>
        </Box>
      </TouchableWithoutFeedback>
      <Spacer mb={2} />
    </GridItem>
  )
}

export const PartnerShows: React.FC<{
  partner: PartnerShows_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [hasRecentShows, setHasRecentShows] = useState(false)
  const [fetchingNextPage, setFetchingNextPage] = useState(false)

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

  const pastShows = partner.pastShows && partner.pastShows.edges
  if (!pastShows && !hasRecentShows) {
    return <PartnerEmptyState text="There are no shows from this gallery yet" />
  }

  return (
    <ScrollView onScroll={isCloseToBottom(fetchNextPage)}>
      <Box px={2} py={3}>
        <PartnerShowsRail partner={partner} setHasRecentShows={setHasRecentShows} />
        {!!pastShows &&
          !!pastShows.length && (
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
        pastShows: showsConnection(status: CLOSED, sort: END_AT_DESC, first: $count, after: $cursor)
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
        ...PartnerShowsRail_partner
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
  background-color: ${color("black10")};
`
