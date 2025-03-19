import { Flex, Screen, Spacer, useSpace } from "@artsy/palette-mobile"
import { FollowedGalleriesQuery } from "__generated__/FollowedGalleriesQuery.graphql"
import { FollowedGalleries_me$key } from "__generated__/FollowedGalleries_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PartnerListItemShort } from "app/Components/PartnerListItemShort"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useRefreshControl } from "app/utils/refreshHelpers"
import React from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface Props {
  me: FollowedGalleries_me$key
}

export const FollowedGalleries: React.FC<Props> = ({ me }) => {
  const space = useSpace()

  const { data, loadNext, isLoadingNext, refetch, hasNext } = usePaginationFragment(
    followedGalleriesFragment,
    me
  )

  const galleries = extractNodes(data.followsAndSaves?.galleriesConnection)

  const RefreshControl = useRefreshControl(refetch)

  if (galleries.length === 0) {
    return (
      <Screen.ScrollView refreshControl={RefreshControl}>
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
      keyExtractor={(item, index) => item.id || index.toString()}
      contentContainerStyle={{ paddingVertical: space(1), paddingHorizontal: space(2) }}
      onEndReachedThreshold={0.2}
      refreshControl={RefreshControl}
      style={{ paddingHorizontal: 0 }}
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
        return <PartnerListItemShort partner={item} disabledLocation />
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
        showBackButton={true}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})
