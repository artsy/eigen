import { OwnerType } from "@artsy/cohesion"
import { ArticleCard_article } from "__generated__/ArticleCard_article.graphql"
import { ArticleCard } from "lib/Components/ArticleCard"
import { ProvideScreenTracking } from "lib/utils/track"
import { PageNames } from "lib/utils/track/schema"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Separator, Spacer } from "palette"
import React from "react"
import { ActivityIndicator, FlatList, RefreshControl } from "react-native"
import { ArticlesHeader } from "./Articles"

interface ArticlesListProps {
  articles: ArticleCard_article[]
  isLoading: () => boolean
  hasMore: () => boolean
  refreshing: boolean
  handleLoadMore: () => void
  handleRefresh: () => void
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  isLoading,
  hasMore,
  articles,
  refreshing,
  handleLoadMore,
  handleRefresh,
}) => {
  const numColumns = useNumColumns()

  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.Articles,
        context_screen_owner_type: OwnerType.articles,
      }}
    >
      <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={8}>
        <Separator />
        <FlatList
          numColumns={numColumns}
          key={`${numColumns}`}
          ListHeaderComponent={() => <ArticlesHeader />}
          data={articles}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          keyExtractor={(item) => `${item.internalID}-${numColumns}`}
          renderItem={({ item, index }) => {
            return (
              <ArticleGridItem index={index}>
                <ArticleCard article={item as any} />
              </ArticleGridItem>
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
interface ArticleGridItemProps {
  index: number
}

export const ArticleGridItem: React.FC<ArticleGridItemProps> = ({ children, index }) => {
  const numColumns = useNumColumns()

  if (numColumns === 1) {
    return <Flex mx="2">{children}</Flex>
  }

  const ml = index % numColumns === 0 ? 2 : 1
  const mr = index % numColumns < numColumns - 1 ? 1 : 2

  return (
    <Flex flex={1 / numColumns} flexDirection="row" ml={ml} mr={mr}>
      <Flex flex={1}>{children}</Flex>
    </Flex>
  )
}

export const useNumColumns = () => {
  const { width, orientation } = useScreenDimensions()
  const isTablet = width > 700

  if (!isTablet) {
    return 1
  }

  return orientation === "portrait" ? 2 : 3
}
