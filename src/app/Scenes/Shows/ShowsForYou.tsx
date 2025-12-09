import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spacer } from "@artsy/palette-mobile"
import { ShowsForYouQuery } from "__generated__/ShowsForYouQuery.graphql"
import { ShowsForYou_showsConnection$key } from "__generated__/ShowsForYou_showsConnection.graphql"
import {
  CardWithMetaDataListItem,
  CardsWithMetaDataListPlaceholder as ShowsForYouPlaceholder,
  useNumColumns,
} from "app/Components/Cards/CardWithMetaData"
import { ShowCardContainer } from "app/Components/ShowCard"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Location, useLocation } from "app/utils/hooks/useLocation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Suspense, useState } from "react"
import { ActivityIndicator, RefreshControl } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface ShowsForYouProps {
  location: Location | null
}

const ShowsForYou: React.FC<ShowsForYouProps> = ({ location }) => {
  const showsForYouQueryVariables = location
    ? { near: location, count: 10 }
    : { includeShowsNearIpBasedLocation: true, count: 10 }

  const queryData = useLazyLoadQuery<ShowsForYouQuery>(
    ShowsForYouScreenQuery,
    showsForYouQueryVariables
  )

  return <ShowsForYouList me={queryData.me} />
}

export const ShowsForYouList: React.FC<{ me: any }> = ({ me }) => {
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
          context_screen_owner_type: OwnerType.shows,
        })}
      >
        <Screen.AnimatedHeader onBack={goBack} title="Shows for You" />
        <Screen.StickySubHeader title="Shows for You" />
        <Screen.Body fullwidth>
          <Screen.FlatList
            testID="shows-for-you-flat-list"
            numColumns={numColumns}
            key={`${numColumns}`}
            data={shows}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            keyExtractor={(item) => `${item.internalID}`}
            renderItem={({ item, index }) => {
              return (
                <CardWithMetaDataListItem index={index}>
                  <ShowCardContainer show={item} isFluid />
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
                style={{ opacity: isLoadingNext && hasNext ? 1 : 0 }}
              >
                <ActivityIndicator testID="activity-indicator" />
              </Flex>
            )}
          />
        </Screen.Body>
      </ProvideScreenTrackingWithCohesionSchema>
    </Screen>
  )
}

export const ShowsForYouScreen: React.FC = () => {
  const { location, isLoading } = useLocation({
    disabled: false,
    skipPermissionRequests: true,
  })

  if (isLoading) {
    return (
      <ShowsForYouPlaceholder title="Shows for You" testID="shows-for-you-screen-placeholder" />
    )
  }

  return (
    <Suspense
      fallback={
        <ShowsForYouPlaceholder title="Shows for You" testID="shows-for-you-screen-placeholder" />
      }
    >
      <ShowsForYou location={location} />
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
          ...ShowCard_show
        }
      }
    }
  }
`
