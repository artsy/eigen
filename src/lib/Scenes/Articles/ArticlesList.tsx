import { ArticleCard_article } from "__generated__/ArticleCard_article.graphql"
import { ArticleCard } from "lib/Components/ArticleCard"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useNumColumns } from "lib/utils/useScreenDimensions"
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
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
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
            if (numColumns === 1) {
              return (
                <Flex mx="2">
                  <ArticleCard article={item as any} />
                </Flex>
              )
            }

            return (
              <Flex flex={1 / numColumns} flexDirection="row">
                {/* left list padding */ index % numColumns === 0 && <Spacer ml="2" />}
                {/* left side separator */ index % numColumns > 0 && <Spacer ml="1" />}
                <Flex flex={1}>
                  <ArticleCard article={item as any} />
                </Flex>
                {/* right side separator*/ index % numColumns < numColumns - 1 && <Spacer mr="1" />}
                {/* right list padding */ index % numColumns === numColumns - 1 && <Spacer mr="2" />}
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
