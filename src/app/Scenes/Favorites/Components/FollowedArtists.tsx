import { Flex, Screen, Spacer, useSpace } from "@artsy/palette-mobile"
import { FollowedArtistsQuery } from "__generated__/FollowedArtistsQuery.graphql"
import { FollowedArtists_me$key } from "__generated__/FollowedArtists_me.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { LoadFailureView } from "app/Components/LoadFailureView"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { FollowOptionPicker } from "app/Scenes/Favorites/FollowsTab"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface Props {
  me: FollowedArtists_me$key
}

export const FollowedArtists: React.FC<Props> = ({ me }) => {
  const space = useSpace()

  const { data, loadNext, isLoadingNext, refetch, hasNext } = usePaginationFragment(
    followedArtistsFragment,
    me
  )

  const artists = extractNodes(data.followsAndSaves?.artistsConnection)

  const RefreshControl = useRefreshControl(refetch)

  const { trackTappedArtistFollowsGroup } = useFavoritesTracking()

  if (data.followsAndSaves?.artistsConnection?.totalCount === 0) {
    return (
      <Screen.ScrollView refreshControl={RefreshControl}>
        <FollowOptionPicker />
        <ZeroState
          title="You haven’t followed any artists yet"
          subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
        />
      </Screen.ScrollView>
    )
  }

  return (
    <Screen.FlatList
      data={artists}
      onEndReached={() => {
        loadNext(PAGE_SIZE)
      }}
      keyExtractor={(item, index) => item.artist?.id || index.toString()}
      onEndReachedThreshold={0.2}
      refreshControl={RefreshControl}
      ListHeaderComponent={FollowOptionPicker}
      ItemSeparatorComponent={() => <Spacer y={2} />}
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
        return (
          <ArtistListItem
            avatarSize="sm"
            artist={item.artist}
            withFeedback
            containerStyle={{ paddingHorizontal: space(2) }}
            onPress={() => {
              trackTappedArtistFollowsGroup(item.artist?.slug, item.artist?.internalID)
            }}
          />
        )
      }}
    />
  )
}

const followedArtistsFragment = graphql`
  fragment FollowedArtists_me on Me
  @refetchable(queryName: "FollowedArtists_artistsConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    labFeatures
    followsAndSaves {
      artistsConnection(first: $count, after: $cursor)
        @connection(key: "FollowedArtists_artistsConnection") {
        totalCount
        edges {
          node {
            artist {
              id
              internalID
              slug
              ...ArtistListItem_artist
            }
          }
        }
      }
    }
  }
`

export const followedArtistsQuery = graphql`
  query FollowedArtistsQuery($count: Int!, $cursor: String) {
    me @required(action: NONE) {
      ...FollowedArtists_me @arguments(count: $count, cursor: $cursor)
    }
  }
`

export const FollowedArtistsQueryRenderer = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<FollowedArtistsQuery>(
      followedArtistsQuery,
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

    return <FollowedArtists me={data?.me} />
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
