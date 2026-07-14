import { Box, Flex, Image, Screen, Spacer, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { FollowedFairsQuery } from "__generated__/FollowedFairsQuery.graphql"
import { FollowedFairs_fair$key } from "__generated__/FollowedFairs_fair.graphql"
import { FollowedFairs_me$key } from "__generated__/FollowedFairs_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { FavoritesContextStore } from "app/Scenes/Favorites/FavoritesContextStore"
import { FollowOptionPicker } from "app/Scenes/Favorites/FollowsTab"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useRefreshControl } from "app/utils/refreshHelpers"
import React from "react"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface Props {
  me: FollowedFairs_me$key
}

export const FollowedFairs: React.FC<Props> = ({ me }) => {
  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)

  const { data, loadNext, isLoadingNext, refetch, hasNext } = usePaginationFragment(
    followedFairsFragment,
    me
  )

  const fairs = extractNodes(data.followsAndSaves?.fairsConnection)

  const RefreshControl = useRefreshControl(refetch, { progressViewOffset: headerHeight })

  if (fairs.length === 0) {
    return (
      <Screen.ScrollView
        refreshControl={RefreshControl}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        <FollowOptionPicker />
        <ZeroState
          title="You haven’t followed any fairs yet"
          subtitle="When you follow fairs, they will show up here for future use."
        />
      </Screen.ScrollView>
    )
  }

  return (
    <Screen.FlatList
      data={fairs}
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
        return <FollowedFairRow fair={item} />
      }}
    />
  )
}

interface FollowedFairRowProps {
  fair: FollowedFairs_fair$key
}

// Minimal, compact list row for a followed fair (image thumbnail + name + exhibition dates).
// Intentionally does not include a follow/save button - that's handled separately by the
// Fair follow button work happening in parallel.
const FollowedFairRow: React.FC<FollowedFairRowProps> = ({ fair: fairProp }) => {
  const color = useColor()
  const fair = useFragment(followedFairRowFragment, fairProp)

  const handleTap = () => {
    navigate(`/fair/${fair.slug}`)
  }

  return (
    <Touchable
      accessibilityRole="button"
      underlayColor={color("mono5")}
      onPress={handleTap}
      style={{ paddingHorizontal: 20, paddingVertical: 5 }}
    >
      <Flex flexDirection="row" alignItems="center">
        <Box width={62} height={62} borderRadius={2} overflow="hidden" backgroundColor="mono10">
          {!!fair.image?.url && <Image width={62} height={62} src={fair.image.url} />}
        </Box>
        <Flex flexDirection="column" flexGrow={1} ml="15px" mr={1}>
          {!!fair.name && (
            <Text variant="sm" lineHeight="20px" color="mono100" weight="medium" numberOfLines={1}>
              {fair.name}
            </Text>
          )}
          {!!fair.exhibition_period && (
            <Text variant="sm" lineHeight="20px" color={color("mono60")} numberOfLines={1}>
              {fair.exhibition_period}
            </Text>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}

const followedFairRowFragment = graphql`
  fragment FollowedFairs_fair on Fair {
    internalID
    slug
    name
    exhibition_period: exhibitionPeriod(format: SHORT)
    image {
      url(version: "square")
    }
  }
`

const followedFairsFragment = graphql`
  fragment FollowedFairs_me on Me
  @refetchable(queryName: "FollowedFairs_fairsConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    followsAndSaves {
      fairsConnection(first: $count, after: $cursor)
        @connection(key: "FollowedFairs_fairsConnection") {
        edges {
          node {
            id
            ...FollowedFairs_fair
          }
        }
      }
    }
  }
`

const followedFairsQuery = graphql`
  query FollowedFairsQuery($count: Int!, $cursor: String) {
    me @required(action: NONE) {
      ...FollowedFairs_me @arguments(count: $count, cursor: $cursor)
    }
  }
`

export const FollowedFairsQueryRenderer = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<FollowedFairsQuery>(
      followedFairsQuery,
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

    return <FollowedFairs me={data?.me} />
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
