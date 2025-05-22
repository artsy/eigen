import { Box, Flex, Spacer, Tabs, Text, useSpace } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { PartnerShows_partner$data } from "__generated__/PartnerShows_partner.graphql"
import { TabEmptyState } from "app/Components/TabEmptyState"

import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { ActivityIndicator, ImageBackground } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { PartnerShowsRailContainer as PartnerShowsRail } from "./PartnerShowsRail"

const PAGE_SIZE = 32

interface ShowGridItemProps {
  show: NonNullable<
    NonNullable<
      NonNullable<NonNullable<PartnerShows_partner$data["pastShows"]>["edges"]>[0]
    >["node"]
  >
  itemIndex: number
}

const ShowGridItem: React.FC<ShowGridItemProps> = (props) => {
  const { show, itemIndex } = props
  const space = useSpace()

  const showImageURL = show?.coverImage?.url

  const styles = itemIndex % 2 === 0 ? { paddingRight: space(1) } : { paddingLeft: space(1) }

  return (
    <GridItem key={show.id}>
      <RouterLink to={`/show/${show.slug}`}>
        <Box style={styles}>
          {showImageURL ? (
            <BackgroundImage key={show.id} resizeMode="cover" source={{ uri: showImageURL }} />
          ) : (
            <EmptyImage />
          )}
          <Spacer y={0.5} />
          <Text variant="sm">{show.name}</Text>
          <Text variant="sm" color="mono60">
            {show.exhibitionPeriod}
          </Text>
        </Box>
      </RouterLink>
      <Spacer y={2} />
    </GridItem>
  )
}

export const PartnerShows: React.FC<{
  partner: PartnerShows_partner$data
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const space = useSpace()
  const recentShows = extractNodes(partner.recentShows).filter((show) => show.isDisplayable)

  const pastShows = extractNodes(partner.pastShows).filter((show) => show.isDisplayable)

  const sections = []

  if (recentShows.length) {
    sections.push({
      key: "recent_shows",
      content: <PartnerShowsRail partner={partner} />,
    })
  }

  if (pastShows.length) {
    sections.push({
      key: "past_shows_header",
      content: (
        <Flex mb={2}>
          <Text variant="sm-display">Past Shows</Text>
        </Flex>
      ),
    })

    // chunk needs to be even to get seamless columns
    const chunkSize = 8
    for (let i = 0; i < pastShows.length; i += chunkSize) {
      const chunk = pastShows.slice(i, i + chunkSize)
      const actualChunkSize = chunk.length
      sections.push({
        key: `chunk ${i}:${actualChunkSize}`,
        content: (
          <Flex flexDirection="row" flexWrap="wrap">
            {chunk.map((node, index) => (
              <ShowGridItem itemIndex={index} key={node.id} show={node} />
            ))}
          </Flex>
        ),
      })
    }
  }

  return (
    <Tabs.FlatList
      contentContainerStyle={{ paddingHorizontal: space(2), marginTop: space(2) }}
      data={sections}
      renderItem={({ item }) => item.content}
      // using tabIsActive here to render only the minimal UI on this tab before the user actually switches to it
      onEndReachedThreshold={1}
      // render up to the first chunk on initial mount
      initialNumToRender={sections.findIndex((section) => section.key.startsWith("chunk")) + 1}
      windowSize={5}
      onEndReached={() => {
        if (isLoadingMore || !relay.hasMore()) {
          return
        }
        setIsLoadingMore(true)
        relay.loadMore(PAGE_SIZE, (error) => {
          if (error) {
            // FIXME: Handle error
            console.error("PartnerShows.tsx", error.message)
          }
          setIsLoadingMore(false)
        })
      }}
      refreshing={isLoadingMore}
      ListEmptyComponent={<TabEmptyState text="There are no shows from this gallery yet" />}
      ListFooterComponent={
        <Flex alignItems="center" justifyContent="center" height={space(6)}>
          {isLoadingMore ? <ActivityIndicator /> : null}
        </Flex>
      }
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
        recentShows: showsConnection(status: CURRENT, first: 10) {
          edges {
            node {
              id
              isDisplayable
            }
          }
        }
        pastShows: showsConnection(
          status: CLOSED
          sort: END_AT_DESC
          first: $count
          after: $cursor
        ) @connection(key: "Partner_pastShows") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              isDisplayable
              id
              name
              slug
              exhibitionPeriod(format: SHORT)
              coverImage {
                url
                aspectRatio
              }
              href
            }
          }
        }
        ...PartnerShowsRail_partner
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.partner && props.partner.pastShows
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
  height: 120px;
`

const GridItem = styled(Box)`
  width: 50%;
`

const EmptyImage = styled(Box)`
  height: 120px;
  background-color: ${themeGet("colors.mono10")};
`

GridItem.displayName = "GridItem"
