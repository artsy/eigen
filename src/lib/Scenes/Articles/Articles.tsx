import { Articles_articlesConnection$key } from "__generated__/Articles_articlesConnection.graphql"
import { ArticlesQuery } from "__generated__/ArticlesQuery.graphql"
import { ArticleCard } from "lib/Components/ArticleCard"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { extractNodes } from "lib/utils/extractNodes"
import {
  PlaceholderBox,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "lib/utils/placeholders"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import _ from "lodash"
import { Flex, Separator, Spacer, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native"
import { ConnectionConfig } from "react-relay"
import { usePagination, useQuery } from "relay-hooks"
import { graphql } from "relay-runtime"
import { RailScrollRef } from "../Home/Components/types"

const PAGE_SIZE = 5

const fragmentSpec = graphql`
  fragment Articles_articlesConnection on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    after: { type: "String" }
    sort: { type: "ArticleSorts" }
    inEditorialFeed: { type: "Boolean" }
  ) {
    articlesConnection(first: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
      @connection(key: "Articles_articlesConnection") {
      edges {
        cursor
        node {
          internalID
          slug
          author {
            name
          }
          href
          thumbnailImage {
            url(version: "large")
          }
          thumbnailTitle
          vertical
          ...ArticleCard_article
        }
      }
    }
  }
`

interface ArticlesProps {
  query: Articles_articlesConnection$key
}

export const ArticlesContainer: React.FC<ArticlesProps> = (props) => {
  const [queryData, { isLoading, hasMore, loadMore, refetchConnection }] = usePagination(fragmentSpec, props.query)
  const articles = extractNodes(queryData.articlesConnection)
  console.log(articles)

  useEffect(() => {
    loadMore(connectionConfig, PAGE_SIZE)
  }, [])

  const [refreshing, setRefreshing] = useState(false)

  const handleLoadMore = () => {
    if (!hasMore() || isLoading()) {
      return
    }
    loadMore(connectionConfig, PAGE_SIZE)
  }
  const handleRefresh = () => {
    setRefreshing(true)
    refetchConnection(connectionConfig, PAGE_SIZE)
    setRefreshing(false)
    scrollRef.current?.scrollToTop()
  }
  const scrollRef = useRef<RailScrollRef>(null)

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      }}
    >
      <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={8}>
        <Separator />
        <FlatList
          numColumns={1}
          key={`${1}`}
          ListHeaderComponent={() => (
            <Text mx="2" variant={"largeTitle"} mb={1} mt={6}>
              Market News
            </Text>
          )}
          data={articles}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          keyExtractor={(item) => `${item.internalID}-${1}`}
          renderItem={({ item }) => {
            return (
              <Flex mx="2">
                <ArticleCard article={item as any} />
              </Flex>
            )
          }}
          ItemSeparatorComponent={() => <Spacer mt="3" />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={1}
          ListFooterComponent={() => (
            <Flex
              alignItems="center"
              justifyContent="center"
              p="3"
              pb="5"
              style={{ opacity: isLoading() && hasMore() ? 1 : 0 }}
            >
              <ActivityIndicator />
            </Flex>
          )}
        />
      </Flex>
    </ProvideScreenTracking>
  )
}

const query = graphql`
  query ArticlesQuery($count: Int, $after: String, $sort: ArticleSorts, $inEditorialFeed: Boolean) {
    ...Articles_articlesConnection
      @arguments(count: $count, after: $after, sort: $sort, inEditorialFeed: $inEditorialFeed)
  }
`

const connectionConfig: ConnectionConfig = {
  query,
  getVariables: (_props, { count, cursor }, _fragmentVariables) => ({
    count,
    after: cursor,
    inEditorialFeed: true,
    sort: "PUBLISHED_AT_DESC",
  }),
}

export const ArticlesQueryRenderer: React.FC = () => {
  const { props, error, retry } = useQuery<ArticlesQuery>(query, {
    count: PAGE_SIZE,
    inEditorialFeed: true,
    sort: "PUBLISHED_AT_DESC",
  })

  if (props) {
    return <ArticlesContainer query={props} />
  }
  if (error) {
    console.error(error)
    return <LoadFailureView onRetry={retry} />
  }

  return <ArticlesPlaceholder />
}

export const ArticlesPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Text mx="2" variant={"largeTitle"} mb={1} mt={6}>
        Market News
      </Text>
      <Flex mx={2}>
        {_.times(4).map(() => (
          <>
            <PlaceholderBox aspectRatio={1.33} width={"100%"} marginBottom={10} />
            <RandomWidthPlaceholderText minWidth={50} maxWidth={100} marginTop={1} />
            <RandomWidthPlaceholderText height={18} minWidth={200} maxWidth={200} marginTop={1} />
            <RandomWidthPlaceholderText minWidth={100} maxWidth={100} marginTop={1} />
            <Spacer mb={2} />
          </>
        ))}
      </Flex>
    </ProvidePlaceholderContext>
  )
}
