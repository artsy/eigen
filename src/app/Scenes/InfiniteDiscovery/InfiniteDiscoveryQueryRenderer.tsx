import { Flex, Screen } from "@artsy/palette-mobile"
import { addBreadcrumb, captureException } from "@sentry/react-native"
import { InfiniteDiscoveryQueryRendererQuery } from "__generated__/InfiniteDiscoveryQueryRendererQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { InfiniteDiscoveryHeader } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryHeader"
import { InfiniteDiscoverySpinner } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoverySpinner"
import {
  InfiniteDiscovery,
  InfiniteDiscoveryArtwork,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { GlobalStore } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { usePrefetch } from "app/utils/queryPrefetching"
import { useCallback, useEffect, useRef, useState } from "react"
import { graphql, Disposable, useLazyLoadQuery } from "react-relay"
import { commitLocalUpdate, createOperationDescriptor, fetchQuery, getRequest } from "relay-runtime"

export const infiniteDiscoveryVariables = {
  excludeArtworkIds: [],
}

export const InfiniteDiscoveryQueryRenderer = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<InfiniteDiscoveryQueryRendererQuery>(
      infiniteDiscoveryQuery,
      infiniteDiscoveryVariables
    )
    // Disposable queries to allow them to be GCed by Relay when calling dispose()
    const queriesForDisposal = useRef<Disposable[]>([])
    const usedExcludeArtworkIds = useRef<string[][]>([])
    const env = getRelayEnvironment()
    const prefetch = usePrefetch()

    const { resetSavedArtworksCount } = GlobalStore.actions.infiniteDiscovery
    const initialArtworks = extractNodes(data.discoverArtworks)
    const [artworks, setArtworks] = useState<InfiniteDiscoveryArtwork[]>(initialArtworks)

    // Retain the queries to not have them GCed when swiping many times
    const retainQuery = useCallback((excludeArtworkIds: string[]) => {
      const queryRequest = getRequest(infiniteDiscoveryQuery)
      const descriptor = createOperationDescriptor(queryRequest, { excludeArtworkIds })
      const disposable = env.retain(descriptor)
      queriesForDisposal.current.push(disposable)
      usedExcludeArtworkIds.current.push(excludeArtworkIds)
    }, [])

    const fetchMoreArtworks = async (excludeArtworkIds: string[], isRetry = false) => {
      try {
        const response = await fetchQuery<InfiniteDiscoveryQueryRendererQuery>(
          env,
          infiniteDiscoveryQuery,
          { excludeArtworkIds },
          { fetchPolicy: "network-only" }
        ).toPromise()
        const newArtworks = extractNodes(response?.discoverArtworks)
        if (newArtworks.length) {
          setArtworks((previousArtworks) => previousArtworks.concat(newArtworks))
        }
        retainQuery(excludeArtworkIds)
      } catch (error) {
        if (!isRetry) {
          addBreadcrumb({ message: "Failed to fetch more artworks, retrying again" })
          fetchMoreArtworks(excludeArtworkIds, true)
          return
        }
        addBreadcrumb({ message: "Failed to fetch more artworks" })
        captureException(error)
      }
    }

    useEffect(() => {
      retainQuery(infiniteDiscoveryVariables.excludeArtworkIds)
      resetSavedArtworksCount()

      // Mark the queries to be disposed by GC, invalidate cache and prefetch a infinite discovery again
      return () => {
        queriesForDisposal.current.forEach((query) => {
          if (!!query.dispose) {
            query.dispose()
          }
        })
        usedExcludeArtworkIds.current.forEach((id) => {
          commitLocalUpdate(env, (store) => {
            store
              ?.getRoot()
              ?.getLinkedRecord("discoverArtworks", { excludeArtworkIds: id })
              ?.invalidateRecord()
          })
        })
        prefetch("/infinite-discovery", infiniteDiscoveryVariables)
      }
    }, [retainQuery])

    return (
      <Flex flex={1}>
        <InfiniteDiscovery fetchMoreArtworks={fetchMoreArtworks} artworks={artworks} />
      </Flex>
    )
  },
  LoadingFallback: InfiniteDiscoverySpinner,
  ErrorFallback: () => (
    <Screen>
      <InfiniteDiscoveryHeader />
      <Screen.Body fullwidth>
        <LoadFailureView />
      </Screen.Body>
    </Screen>
  ),
})

export const infiniteDiscoveryQuery = graphql`
  query InfiniteDiscoveryQueryRendererQuery($excludeArtworkIds: [String!]!) {
    discoverArtworks(excludeArtworkIds: $excludeArtworkIds) {
      edges {
        node {
          ...InfiniteDiscoveryArtworkCard_artwork

          internalID @required(action: NONE)
          artists(shallow: true) @required(action: NONE) {
            internalID @required(action: NONE)
          }
          slug
          title
        }
      }
    }
  }
`
