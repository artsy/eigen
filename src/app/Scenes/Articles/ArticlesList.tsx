import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import {
  PlaceholderBox,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import _ from "lodash"
import { Flex, Separator, Spacer, Text } from "palette"
import { ActivityIndicator, FlatList, RefreshControl } from "react-native"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
interface ArticlesListProps {
  articles: ArticleCard_article$data[]
  isLoading: () => boolean
  hasMore: () => boolean
  refreshing: boolean
  handleLoadMore: () => void
  handleRefresh: () => void
  title: string
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  isLoading,
  hasMore,
  articles,
  refreshing,
  handleLoadMore,
  handleRefresh,
  title,
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
          ListHeaderComponent={() => <ArticlesHeader title={title} />}
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
          ItemSeparatorComponent={() => <Spacer mt="4" />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={1}
          ListFooterComponent={() => (
            <Flex
              alignItems="center"
              justifyContent="center"
              p="4"
              pb="6"
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

export const ArticlesPlaceholder = () => {
  const numColumns = useNumColumns()

  return (
    <ProvidePlaceholderContext>
      <Flex flexDirection="column" justifyContent="space-between" height="100%" pb={8}>
        <Separator />
        <FlatList
          numColumns={numColumns}
          key={`${numColumns}`}
          ListHeaderComponent={() => <ArticlesHeader />}
          data={_.times(6)}
          keyExtractor={(item) => `${item}-${numColumns}`}
          renderItem={({ item }) => {
            return (
              <ArticlesListItem index={item} key={item}>
                <PlaceholderBox aspectRatio={1.33} width="100%" marginBottom={10} />
                <RandomWidthPlaceholderText minWidth={50} maxWidth={100} marginTop={1} />
                <RandomWidthPlaceholderText
                  height={18}
                  minWidth={200}
                  maxWidth={200}
                  marginTop={1}
                />
                <RandomWidthPlaceholderText minWidth={100} maxWidth={100} marginTop={1} />
                <Spacer mb={2} />
              </ArticlesListItem>
            )
          }}
          ItemSeparatorComponent={() => <Spacer mt="4" />}
          onEndReachedThreshold={1}
        />
      </Flex>
    </ProvidePlaceholderContext>
  )
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

export const ArticlesHeader = ({ title = "" }) => (
  <Text mx="2" variant="lg-display" mb={1} mt={6}>
    {title}
  </Text>
)
