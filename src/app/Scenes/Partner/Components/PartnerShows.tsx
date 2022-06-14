import { themeGet } from "@styled-system/theme-get"
import { PartnerShows_partner$data } from "__generated__/PartnerShows_partner.graphql"
import { useNativeValue } from "app/Components/StickyTabPage/reanimatedHelpers"
import {
  StickyTabPageFlatList,
  StickyTabPageFlatListContext,
  StickyTabSection,
} from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Box, ClassTheme, Flex, Sans, Spacer } from "palette"
import React, { useContext, useState } from "react"
import { ActivityIndicator, ImageBackground, TouchableWithoutFeedback, View } from "react-native"
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

class ShowGridItem extends React.Component<ShowGridItemProps> {
  onPress = () => {
    const { show } = this.props
    navigate(`/show/${show.slug}`)
  }

  render() {
    const { show, itemIndex } = this.props
    const showImageURL = show.coverImage && show.coverImage.url

    return (
      <ClassTheme>
        {({ space }) => {
          const styles =
            itemIndex % 2 === 0 ? { paddingRight: space(1) } : { paddingLeft: space(1) }
          return (
            <GridItem key={show.id}>
              <TouchableWithoutFeedback onPress={this.onPress}>
                <Box style={styles}>
                  {showImageURL ? (
                    <BackgroundImage
                      key={show.id}
                      resizeMode="cover"
                      source={{ uri: showImageURL }}
                    />
                  ) : (
                    <EmptyImage />
                  )}
                  <Spacer mb={0.5} />
                  <Sans size="3t">{show.name}</Sans>
                  <Sans size="3t" color="black60">
                    {show.exhibitionPeriod}
                  </Sans>
                </Box>
              </TouchableWithoutFeedback>
              <Spacer mb={2} />
            </GridItem>
          )
        }}
      </ClassTheme>
    )
  }
}

export const PartnerShows: React.FC<{
  partner: PartnerShows_partner$data
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const recentShows = extractNodes(partner.recentShows).filter((show) => show.isDisplayable)

  const pastShows = extractNodes(partner.pastShows).filter((show) => show.isDisplayable)

  const sections: StickyTabSection[] = []

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
          <Sans size="4t">Past shows</Sans>
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

  const tabContext = useContext(StickyTabPageFlatListContext)

  const tabIsActive = Boolean(useNativeValue(tabContext.tabIsActive, 0))

  return (
    <ClassTheme>
      {({ space }) => (
        <View style={{ flex: 1 }}>
          <StickyTabPageFlatList
            data={sections}
            // using tabIsActive here to render only the minimal UI on this tab before the user actually switches to it
            onEndReachedThreshold={tabIsActive ? 1 : 0}
            // render up to the first chunk on initial mount
            initialNumToRender={
              sections.findIndex((section) => section.key.startsWith("chunk")) + 1
            }
            windowSize={tabIsActive ? 5 : 1}
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
            contentContainerStyle={{ paddingTop: 20 }}
            ListEmptyComponent={<TabEmptyState text="There are no shows from this gallery yet" />}
            ListFooterComponent={
              <Flex alignItems="center" justifyContent="center" height={space(6)}>
                {isLoadingMore ? <ActivityIndicator /> : null}
              </Flex>
            }
          />
        </View>
      )}
    </ClassTheme>
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
  height: 120;
`

const GridItem = styled(Box)`
  width: 50%;
`

const EmptyImage = styled(Box)`
  height: 120;
  background-color: ${themeGet("colors.black10")};
`

GridItem.displayName = "GridItem"
