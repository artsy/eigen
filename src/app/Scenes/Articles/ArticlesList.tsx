import { Spacer, Flex, Text, Screen } from "@artsy/palette-mobile"
import { ArticleCard_article$data } from "__generated__/ArticleCard_article.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { useScreenDimensions } from "app/utils/hooks"
import {
  PlaceholderBox,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { times } from "lodash"
import { ActivityIndicator, FlatList, RefreshControl } from "react-native"
import { isTablet } from "react-native-device-info"
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
          <ArticlesListItem index={index}>
            <ArticleCardContainer
              article={item as any}
              isFluid
              onPress={() => handleOnPress(item)}
            />
          </ArticlesListItem>
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
interface ArticlesListItemProps {
  index: number
}

export const ArticlesListItem: React.FC<ArticlesListItemProps> = ({ children, index }) => {
  const numColumns = useNumColumns()

  if (numColumns === 1) {
    return <Flex mx={2}>{children}</Flex>
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
  const { orientation } = useScreenDimensions()

  if (!isTablet()) {
    return 1
  }

  return orientation === "portrait" ? 2 : 3
}

interface ArticlesPlaceholderProps {
  title?: string
}

export const ArticlesPlaceholder: React.FC<ArticlesPlaceholderProps> = ({
  title = "Artsy Editorial",
}) => {
  const numColumns = useNumColumns()

  return (
    <Screen>
      <Screen.AnimatedHeader title={title} />
      <Screen.Body fullwidth>
        <ProvidePlaceholderContext>
          <Flex
            testID="articles-screen-placeholder"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
          >
            <FlatList
              numColumns={numColumns}
              key={`${numColumns}`}
              ListHeaderComponent={() => <ArticlesHeader title={title} />}
              data={times(6)}
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
                    <Spacer y={2} />
                  </ArticlesListItem>
                )
              }}
              ItemSeparatorComponent={() => <Spacer y={4} />}
              onEndReachedThreshold={1}
            />
          </Flex>
        </ProvidePlaceholderContext>
      </Screen.Body>
    </Screen>
  )
}

export const ArticlesHeader = ({ title = "" }) => (
  <Text mx={2} variant="lg-display" mb={2}>
    {title}
  </Text>
)
