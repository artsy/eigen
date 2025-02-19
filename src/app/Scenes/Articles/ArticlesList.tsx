import { Spacer, Flex, Screen } from "@artsy/palette-mobile"
import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { CardWithMetaDataListItem, useNumColumns } from "app/Components/Cards/CardWithMetaData"
import { ActivityIndicator, RefreshControl } from "react-native"
interface ArticlesListProps {
  articles: ArticleCard_article$data[]
  isLoading: () => boolean
  hasMore: () => boolean
  refreshing: boolean
  handleLoadMore: () => void
  handleRefresh: () => void
  handleOnPress: (article: ArticleCard_article$data) => void
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  isLoading,
  hasMore,
  articles,
  refreshing,
  handleLoadMore,
  handleOnPress,
  handleRefresh,
}) => {
  const numColumns = useNumColumns()

  return (
    <Screen.FlatList
      numColumns={numColumns}
      key={`${numColumns}`}
      data={articles}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      keyExtractor={(item) => `${item.internalID}-${numColumns}`}
      renderItem={({ item, index }) => {
        return (
          <CardWithMetaDataListItem index={index}>
            <ArticleCardContainer
              article={item as any}
              isFluid
              onPress={() => handleOnPress(item)}
            />
          </CardWithMetaDataListItem>
        )
      }}
      ItemSeparatorComponent={() => <Spacer y={4} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={1}
      style={{ paddingTop: 20 }}
      ListFooterComponent={() => (
        <Flex
          alignItems="center"
          justifyContent="center"
          p={4}
          pb={6}
          style={{ opacity: isLoading() && hasMore() ? 1 : 0 }}
        >
          <ActivityIndicator />
        </Flex>
      )}
    />
  )
}
