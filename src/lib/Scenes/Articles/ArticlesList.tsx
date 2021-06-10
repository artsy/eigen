import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ArticleCard_article } from "__generated__/ArticleCard_article.graphql"
import { ArticleCardContainer } from "lib/Components/ArticleCard"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Separator, Spacer } from "palette"
import React from "react"
import { ActivityIndicator, FlatList, RefreshControl } from "react-native"
import { useTracking } from "react-tracking"
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

  const tracking = useTracking()

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.articles,
      })}
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
              <ArticlesListItem index={index}>
                <ArticleCardContainer
                  article={item as any}
                  isFluid
                  onPress={() => {
                    const tapEvent = tracks.tapArticlesListItem(item.internalID, item.slug || "")
                    tracking.trackEvent(tapEvent)
                  }}
                />
              </ArticlesListItem>
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
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
interface ArticlesListItemProps {
  index: number
}

export const ArticlesListItem: React.FC<ArticlesListItemProps> = ({ children, index }) => {
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

export const tracks = {
  tapArticlesListItem: (articleId: string, articleSlug: string) => ({
    action: ActionType.tappedArticleGroup,
    context_module: ContextModule.articles,
    context_screen_owner_type: OwnerType.articles,
    destination_screen_owner_type: OwnerType.article,
    destination_screen_owner_id: articleId,
    destination_screen_owner_slug: articleSlug,
  }),
}
