import { OwnerType } from "@artsy/cohesion"
import { Box, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ShowsForYouQuery } from "__generated__/ShowsForYouQuery.graphql"
import { ShowsForYou_showsConnection$key } from "__generated__/ShowsForYou_showsConnection.graphql"
import { ArticlesPlaceholder, useNumColumns } from "app/Scenes/Articles/ArticlesList"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useLocation } from "app/utils/hooks/useLocation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const ShowsForYou: React.FC = () => {
  const enableShowsForYouLocation = useFeatureFlag("AREnableShowsForYouLocation")

  const { location, isLoading } = useLocation({
    disabled: !enableShowsForYouLocation,
    skipPermissionRequests: true,
  })
  console.log("LOGD location = ", location)

  const showsForYouQueryVariables = location
    ? { near: location, count: 10 }
    : { includeShowsNearIpBasedLocation: enableShowsForYouLocation && !location, count: 10 }

  const queryData = useLazyLoadQuery<ShowsForYouQuery>(
    ShowsForYouScreenQuery,
    showsForYouQueryVariables
  )

  return <ShowsForYouList me={queryData.me} />
}

export const ShowsForYouList: React.FC<{ me: any }> = ({ me }) => {
  console.log("LOGD ShowsForYouList me = ", me)
  const [refreshing, setRefreshing] = useState(false)

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    ShowsForYouQuery,
    ShowsForYou_showsConnection$key
  >(showsNearYouConnectionFragment, me)

  const numColumns = useNumColumns()

  if (!data) {
    return null
  }
  const shows = extractNodes(data.showsConnection)

  console.log("LOGD data = ", data, shows)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }
    loadNext(10)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch({})
    setRefreshing(false)
  }

  return (
    <Screen>
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({
          context_screen_owner_type: OwnerType.shows, // todo: change to showsForYou?
        })}
      >
        <Screen.AnimatedHeader onBack={goBack} title="Shows for You" />
        <Screen.StickySubHeader title="Shows for You" />
        <Screen.Body fullwidth>
          <Screen.FlatList
            numColumns={numColumns}
            key={`${numColumns}`}
            data={shows}
            // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            keyExtractor={(item) => `${item.internalID}-${numColumns}`}
            renderItem={({ item, index }) => {
              console.log("LOGD item = ", item)
              return (
                <Box height={200} backgroundColor="pink">
                  <Text>{index}</Text>
                </Box>

                /*  <ArticlesListItem index={index}>
                  <ArticleCardContainer
                    article={item as any}
                    isFluid
                    onPress={() => handleOnPress(item)}
                  />
                </ArticlesListItem> */
              )
            }}
            ItemSeparatorComponent={() => <Spacer y={4} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={1}
            style={{ paddingTop: 20 }}
            /*             ListFooterComponent={() => (
              <Flex
                alignItems="center"
                justifyContent="center"
                p={4}
                pb={6}
                style={{ opacity: isLoadingNext && hasNext ? 1 : 0 }}
              >
                <ActivityIndicator />
              </Flex>
            )} */
          />
        </Screen.Body>
      </ProvideScreenTrackingWithCohesionSchema>
    </Screen>
  )
}

export const ShowsForYouScreen: React.FC = () => {
  // TODO: write another placeholder???
  return (
    <Suspense fallback={<ArticlesPlaceholder title="Shows for You" />}>
      <ShowsForYou />
    </Suspense>
  )
}

export const ShowsForYouScreenQuery = graphql`
  query ShowsForYouQuery(
    $count: Int
    $after: String
    $near: Near
    $includeShowsNearIpBasedLocation: Boolean
  ) @cacheable {
    me {
      ...ShowsForYou_showsConnection
        @arguments(
          count: $count
          after: $after
          near: $near
          includeShowsNearIpBasedLocation: $includeShowsNearIpBasedLocation
        )
    }
  }
`

const showsNearYouConnectionFragment = graphql`
  fragment ShowsForYou_showsConnection on Me
  @refetchable(queryName: "ShowsForYou_showsConnectionRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
    near: { type: "Near" }
    includeShowsNearIpBasedLocation: { type: "Boolean" }
  ) {
    showsConnection(
      first: $count
      after: $after
      near: $near
      includeShowsNearIpBasedLocation: $includeShowsNearIpBasedLocation
      status: RUNNING_AND_UPCOMING
    ) @connection(key: "ShowsForYou_showsConnection") {
      edges {
        node {
          internalID
          slug
        }
      }
    }
  }
`
