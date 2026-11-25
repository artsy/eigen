import { Button, Flex, Spinner, Tabs, Text } from "@artsy/palette-mobile"
import { MyCollectionListingsQuery } from "__generated__/MyCollectionListingsQuery.graphql"
import { MyCollectionListings_me$key } from "__generated__/MyCollectionListings_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { MyCollectionListingRow } from "app/Scenes/MyCollection/Components/MyCollectionListingRow"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import {
  MY_COLLECTION_REFRESH_KEY,
  RefreshEvents,
  useRefreshControl,
} from "app/utils/refreshHelpers"
import { startTransition, useCallback, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const PAGE_SIZE = 20

interface MyCollectionListingsProps {
  me: MyCollectionListings_me$key
}

export const MyCollectionListings: React.FC<MyCollectionListingsProps> = ({ me }) => {
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment(meFragment, me)

  const listings = extractNodes(data.resaleSubmissionsConnection)

  const RefreshControl = useRefreshControl(refetch, { pageSize: PAGE_SIZE })

  useEffect(() => {
    // A plain refetch suspends and swaps the list for the loading spinner
    const onRefresh = () =>
      startTransition(() => {
        refetch({}, { fetchPolicy: "store-and-network" })
      })
    RefreshEvents.addListener(MY_COLLECTION_REFRESH_KEY, onRefresh)
    return () => {
      RefreshEvents.removeListener(MY_COLLECTION_REFRESH_KEY, onRefresh)
    }
  }, [refetch])

  const loadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(PAGE_SIZE)
    }
  }, [hasNext, isLoadingNext, loadNext])

  if (listings.length === 0) {
    return (
      <Tabs.ScrollView testID="my-collection-listings" refreshControl={RefreshControl}>
        <MyCollectionListingsEmptyState />
      </Tabs.ScrollView>
    )
  }

  return (
    <Tabs.FlashList
      testID="my-collection-listings"
      data={listings}
      keyExtractor={(item) => item.internalID}
      renderItem={({ item }) => <MyCollectionListingRow resaleSubmission={item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingNext ? (
          <Flex alignItems="center" py={2}>
            <Spinner />
          </Flex>
        ) : null
      }
      refreshControl={RefreshControl}
    />
  )
}

interface MyCollectionListingsContentProps {
  retryKey: number
  onRetry: () => void
}

const MyCollectionListingsContent = withSuspense<MyCollectionListingsContentProps>({
  Component: ({ retryKey }) => {
    const data = useLazyLoadQuery<MyCollectionListingsQuery>(
      myCollectionListingsQuery,
      {},
      { fetchKey: retryKey, fetchPolicy: "store-and-network" }
    )

    return <MyCollectionListings me={data.me} />
  },
  LoadingFallback: () => (
    <Tabs.ScrollView testID="my-collection-listings-loading">
      <Flex alignItems="center" py={4}>
        <Spinner />
      </Flex>
    </Tabs.ScrollView>
  ),
  ErrorFallback: (fallbackProps, { onRetry }) => (
    <LoadFailureView
      onRetry={() => {
        onRetry()
        fallbackProps.resetErrorBoundary()
      }}
      showBackButton={false}
      useSafeArea={false}
      error={fallbackProps.error}
      trackErrorBoundary={false}
    />
  ),
})

// Relay keeps a failed query in its cache, so a retry needs a new fetchKey to refetch.
export const MyCollectionListingsQueryRenderer: React.FC = () => {
  const [retryKey, setRetryKey] = useState(0)

  return (
    <MyCollectionListingsContent
      retryKey={retryKey}
      onRetry={() => setRetryKey((key) => key + 1)}
    />
  )
}

export const MyCollectionListingsEmptyState: React.FC = () => {
  return (
    <Flex bg="mono5" mt={2} px={2} py={4} gap={1} alignItems="center">
      <Text variant="lg-display" textAlign="center">
        Thought about selling?
      </Text>
      <Text variant="sm" color="mono60" textAlign="center">
        Tell us which works you have considered selling, and we can support you from there.
      </Text>

      <Flex mt={2}>
        <Button
          haptic
          variant="fillDark"
          icon={<BetaBadge />}
          iconPosition="right"
          onPress={() => navigate("/my-collection/sell")}
        >
          Sell With Us
        </Button>
      </Flex>
    </Flex>
  )
}

const BetaBadge: React.FC = () => (
  <Flex bg="mono0" borderRadius={10} px={1} py={0.5} ml={1}>
    <Text variant="xxs" weight="medium">
      BETA
    </Text>
  </Flex>
)

const meFragment = graphql`
  fragment MyCollectionListings_me on Me
  @refetchable(queryName: "MyCollectionListingsRefetchQuery")
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
    resaleSubmissionsConnection(first: $count, after: $cursor, sort: UPDATED_AT_DESC)
      @connection(key: "MyCollectionListings_resaleSubmissionsConnection")
      @required(action: THROW) {
      edges {
        node {
          internalID
          ...MyCollectionListingRow_resaleSubmission
        }
      }
    }
  }
`

const myCollectionListingsQuery = graphql`
  query MyCollectionListingsQuery {
    me @required(action: THROW) {
      ...MyCollectionListings_me
    }
  }
`
