import { Flex, Screen, Spacer, useSpace } from "@artsy/palette-mobile"
import { FollowedGalleriesQuery } from "__generated__/FollowedGalleriesQuery.graphql"
import { FollowedGalleries_me$key } from "__generated__/FollowedGalleries_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PartnerListItemShort } from "app/Components/PartnerListItemShort"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { FollowOptionPicker } from "app/Scenes/Favorites/FollowsTab"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useRefreshControl } from "app/utils/refreshHelpers"
import React from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface Props {
  me: FollowedGalleries_me$key
}

export const FollowedGalleries: React.FC<Props> = ({ me }) => {
  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)

  const space = useSpace()
  const { trackTappedGalleryFollowsGroup } = useFavoritesTracking()

  const { data, loadNext, isLoadingNext, refetch, hasNext } = usePaginationFragment(
    followedGalleriesFragment,
    me
  )

  const galleries = extractNodes(data.followsAndSaves?.galleriesConnection)

  const RefreshControl = useRefreshControl(refetch, { progressViewOffset: headerHeight })

  if (galleries.length === 0) {
    return (
      <Screen.ScrollView
        refreshControl={RefreshControl}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        <FollowOptionPicker />
        <ZeroState
          title="You haven’t followed any galleries yet"
          subtitle="When you save galleries, they will show up here."
        />
      </Screen.ScrollView>
    )
  }

  return (
    <Screen.FlatList
      data={galleries}
      onEndReached={() => {
        loadNext(PAGE_SIZE)
      }}
      ListHeaderComponent={FollowOptionPicker}
      keyExtractor={(item, index) => item.id || index.toString()}
      contentContainerStyle={{ paddingHorizontal: space(2), paddingTop: headerHeight }}
      onEndReachedThreshold={0.2}
      refreshControl={RefreshControl}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      ListFooterComponent={() =>
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
          <PartnerListItemShort
            partner={item}
            disabledLocation
            onPress={() => {
              trackTappedGalleryFollowsGroup(item.slug, item.internalID)
            }}
          />
        )
      }}
    />
  )
}

const followedGalleriesFragment = graphql`
  fragment FollowedGalleries_me on Me
  @refetchable(queryName: "FollowedGalleries_galleriesConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    labFeatures
    followsAndSaves {
      galleriesConnection(first: $count, after: $cursor)
        @connection(key: "FollowedGalleries_galleriesConnection") {
        edges {
          node {
            id
            internalID
            slug
            ...PartnerListItemShort_partner
          }
        }
      }
    }
  }
`

const followedGalleriesQuery = graphql`
  query FollowedGalleriesQuery($count: Int!, $cursor: String) {
    me @required(action: NONE) {
      ...FollowedGalleries_me @arguments(count: $count, cursor: $cursor)
    }
  }
`

export const FollowedGalleriesQueryRenderer = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<FollowedGalleriesQuery>(
      followedGalleriesQuery,
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

    return <FollowedGalleries me={data?.me} />
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
