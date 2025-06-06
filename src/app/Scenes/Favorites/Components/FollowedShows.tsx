import { Flex, Screen, Spacer } from "@artsy/palette-mobile"
import { FollowedShowsQuery } from "__generated__/FollowedShowsQuery.graphql"
import { FollowedShows_me$key } from "__generated__/FollowedShows_me.graphql"
import { ShowItemRow } from "app/Components/Lists/ShowItemRow"
import { LoadFailureView } from "app/Components/LoadFailureView"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { FollowOptionPicker } from "app/Scenes/Favorites/FollowsTab"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useRefreshControl } from "app/utils/refreshHelpers"
import React from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface Props {
  me: FollowedShows_me$key
}

export const FollowedShows: React.FC<Props> = ({ me }) => {
  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)

  const { data, loadNext, isLoadingNext, refetch, hasNext } = usePaginationFragment(
    followedShowsFragment,
    me
  )

  const shows = extractNodes(data.followsAndSaves?.showsConnection)

  const RefreshControl = useRefreshControl(refetch)

  if (shows.length === 0) {
    return (
      <Screen.ScrollView
        refreshControl={RefreshControl}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        <FollowOptionPicker />
        <ZeroState
          title="You haven’t saved any shows yet"
          subtitle="When you save shows, they will show up here for future use."
        />
      </Screen.ScrollView>
    )
  }

  return (
    <Screen.FlatList
      data={shows}
      onEndReached={() => {
        loadNext(PAGE_SIZE)
      }}
      keyExtractor={(item, index) => item.id || index.toString()}
      onEndReachedThreshold={0.2}
      refreshControl={RefreshControl}
      style={{ paddingHorizontal: 0 }}
      contentContainerStyle={{ paddingTop: headerHeight }}
      ListHeaderComponent={FollowOptionPicker}
      ItemSeparatorComponent={() => <Spacer y={1} />}
      ListFooterComponent={
        isLoadingNext && hasNext ? (
          <Flex my={4} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Spacer y={2} />
        )
      }
      renderItem={({ item }) => {
        return <ShowItemRow show={item} isListItem />
      }}
    />
  )
}

const followedShowsFragment = graphql`
  fragment FollowedShows_me on Me
  @refetchable(queryName: "FollowedShows_showsConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    labFeatures
    followsAndSaves {
      showsConnection(first: $count, after: $cursor)
        @connection(key: "FollowedShows_showsConnection") {
        edges {
          node {
            id
            ...ShowItemRow_show
          }
        }
      }
    }
  }
`

const followedShowsQuery = graphql`
  query FollowedShowsQuery($count: Int!, $cursor: String) {
    me @required(action: NONE) {
      ...FollowedShows_me @arguments(count: $count, cursor: $cursor)
    }
  }
`

export const FollowedShowsQueryRenderer = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<FollowedShowsQuery>(
      followedShowsQuery,
      {
        count: PAGE_SIZE,
      },
      {
        fetchPolicy: "store-and-network",
      }
    )

    if (!data?.me) {
      return null
    }

    return <FollowedShows me={data?.me} />
  },
  LoadingFallback: () => <Spinner />,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        showBackButton={false}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})
