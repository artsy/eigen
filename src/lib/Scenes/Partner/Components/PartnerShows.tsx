import { Box, color, Flex, Sans, Serif, space, Spacer } from "@artsy/palette"
import { PartnerShows_partner } from "__generated__/PartnerShows_partner.graphql"
import Spinner from "lib/Components/Spinner"
import { useNativeValue } from "lib/Components/StickyTabPage/reanimatedHelpers"
import {
  StickyTabPageFlatList,
  StickyTabPageFlatListContext,
  StickyTabSection,
} from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { TabEmptyState } from "lib/Components/TabEmptyState"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useContext, useMemo, useState } from "react"
import { ImageBackground, TouchableWithoutFeedback } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { PartnerShowsRailContainer as PartnerShowsRail } from "./PartnerShowsRail"

const PAGE_SIZE = 32

interface ShowGridItemProps {
  show: PartnerShows_partner["pastShows"]["edges"][0]["node"]
  itemIndex: number
}

class ShowGridItem extends React.Component<ShowGridItemProps> {
  onPress = () => {
    const { show } = this.props
    SwitchBoard.presentNavigationViewController(this, `/show/${show.slug}`)
  }

  render() {
    const { show, itemIndex } = this.props
    const showImageURL = show.coverImage && show.coverImage.url
    const styles = itemIndex % 2 === 0 ? { paddingRight: space(1) } : { paddingLeft: space(1) }

    return (
      <GridItem key={show.id}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          <Box style={styles}>
            {showImageURL ? (
              <BackgroundImage key={show.id} style={{ resizeMode: "cover" }} source={{ uri: showImageURL }} />
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
}

export const PartnerShows: React.FC<{
  partner: PartnerShows_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const hasRecentShows = partner.recentShows.edges.length > 0

  const pastShows = partner.pastShows && partner.pastShows.edges

  const sections: StickyTabSection[] = useMemo(
    () => {
      if (!pastShows && !hasRecentShows) {
        return [
          {
            key: "empty_state",
            content: <TabEmptyState text="There are no shows from this gallery yet" />,
          },
        ]
      }

      const result: StickyTabSection[] = []
      if (hasRecentShows) {
        result.push({
          key: "recent_shows",
          content: <PartnerShowsRail partner={partner} />,
        })
      }

      if (partner.pastShows.edges.length) {
        result.push({
          key: "past_shows_header",
          content: (
            <Flex mb={2}>
              <Sans size="3t" weight="medium">
                Past shows
              </Sans>
            </Flex>
          ),
        })

        // chunk needs to be even to get seamless columns
        const chunkSize = 8
        for (let i = 0; i < partner.pastShows.edges.length; i += chunkSize) {
          const chunk = partner.pastShows.edges.slice(i, i + chunkSize)
          const actualChunkSize = chunk.length
          result.push({
            key: `chunk ${i}:${actualChunkSize}`,
            content: (
              <Flex flexDirection="row" flexWrap="wrap">
                {chunk.map(({ node }, index) => (
                  <ShowGridItem itemIndex={index} key={node.id} show={node} />
                ))}
              </Flex>
            ),
          })
        }
      }

      return result
    },
    [partner.pastShows.edges, hasRecentShows, pastShows]
  )

  const tabContext = useContext(StickyTabPageFlatListContext)

  const tabIsActive = Boolean(useNativeValue(tabContext.tabIsActive, 0))

  return (
    <StickyTabPageFlatList
      data={sections}
      // using tabIsActive here to render only the minimal UI on this tab before the user actually switches to it
      onEndReachedThreshold={tabIsActive ? 1 : 0}
      // render up to the first chunk on initial mount
      initialNumToRender={sections.findIndex(section => section.key.startsWith("chunk")) + 1}
      windowSize={tabIsActive ? 5 : 1}
      onEndReached={() => {
        if (isLoadingMore || !relay.hasMore()) {
          return
        }
        setIsLoadingMore(true)
        relay.loadMore(PAGE_SIZE, error => {
          if (error) {
            // FIXME: Handle error
            console.error("PartnerShows.tsx", error.message)
          }
          setIsLoadingMore(false)
        })
      }}
      refreshing={isLoadingMore}
      ListFooterComponent={() => (
        <Flex alignItems="center" justifyContent="center" height={space(6)}>
          {isLoadingMore ? <Spinner /> : null}
        </Flex>
      )}
    />
  )
}

export const PartnerShowsFragmentContainer = createPaginationContainer(
  PartnerShows,
  {
    partner: graphql`
      fragment PartnerShows_partner on Partner
        @argumentDefinitions(count: { type: "Int", defaultValue: 32 }, cursor: { type: "String" }) {
        slug
        internalID
        # need to know whether there are any current shows
        recentShows: showsConnection(status: CURRENT, first: 1) {
          edges {
            node {
              id
            }
          }
        }
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

GridItem.displayName = "GridItem"
