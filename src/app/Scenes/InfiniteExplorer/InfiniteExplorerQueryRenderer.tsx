import { Flex, Screen } from "@artsy/palette-mobile"
import { addBreadcrumb, captureException } from "@sentry/react-native"
import { InfiniteDiscoveryQueryRendererQuery } from "__generated__/InfiniteDiscoveryQueryRendererQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { InfiniteDiscoverySpinner } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoverySpinner"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import {
  infiniteDiscoveryQuery,
  infiniteDiscoveryVariables,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryQueryRenderer"
import { InfiniteExplorer } from "app/Scenes/InfiniteExplorer/InfiniteExplorer"
import { TOTAL_COLUMN_COUNT, useColumnWidth } from "app/Scenes/InfiniteExplorer/hooks/useColumnLayout"
import { createEmptyColumns, distributeRoundRobin } from "app/Scenes/InfiniteExplorer/utils/distributeRoundRobin"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback, useEffect, useRef, useState } from "react"
import { Disposable, useLazyLoadQuery } from "react-relay"
import { commitLocalUpdate, createOperationDescriptor, fetchQuery, getRequest } from "relay-runtime"

// discoverArtworks takes excludeArtworkIds as repeated GET query params, so
// an unbounded list eventually makes the URL too long and the request
// starts failing. A many-column grid can rack up a long exclusion history
// fast, so cap what's actually sent to the most recently seen artworks —
// older ones falling off just means they could reappear after a long
// session, which is an acceptable trade for not breaking pagination.
const MAX_EXCLUDE_ARTWORK_IDS = 150

export const InfiniteExplorerQueryRenderer = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<InfiniteDiscoveryQueryRendererQuery>(
      infiniteDiscoveryQuery,
      infiniteDiscoveryVariables
    )

    const columnWidth = useColumnWidth()

    const env = getRelayEnvironment()

    // Disposable queries to allow them to be GCed by Relay when calling dispose()
    const queriesForDisposal = useRef<Disposable[]>([])
    const usedExcludeArtworkIds = useRef<string[][]>([])

    const initialArtworks = extractNodes(data.discoverArtworks)

    // The single shared exclusion pool. Every fetch (regardless of which
    // column triggered it) reads from and appends to this same list, so no
    // two columns can ever be handed the same not-yet-excluded artwork.
    const excludeArtworkIdsRef = useRef<string[]>(initialArtworks.map((a) => a.internalID))

    // Every artwork currently rendered anywhere, independent of the capped
    // exclude list above — since that cap lets old exclusions fall off (and
    // the server's discovery pool can itself run dry), the server can hand
    // back something we already have. This is the actual guarantee against
    // rendering (and round-robin-ing) the same artwork into a column twice.
    const allArtworkIdsRef = useRef<Set<string>>(new Set(initialArtworks.map((a) => a.internalID)))

    // Chaining onto this promise is the in-flight lock: a column that
    // requests more while a fetch is outstanding just appends to the same
    // chain, guaranteeing fetches (and the exclude-list reads/appends around
    // them) are serialized rather than racing.
    const fetchQueueRef = useRef<Promise<void>>(Promise.resolve())

    // Rotates which column a batch starts filling from — see
    // distributeRoundRobin's doc comment for why this matters whenever a
    // page of artworks is smaller than TOTAL_COLUMN_COUNT.
    const roundRobinOffsetRef = useRef(0)

    const [columns, setColumns] = useState<InfiniteDiscoveryArtwork[][]>(() => {
      const offset = roundRobinOffsetRef.current
      roundRobinOffsetRef.current = offset + initialArtworks.length
      return distributeRoundRobin(createEmptyColumns(TOTAL_COLUMN_COUNT), initialArtworks, undefined, offset)
    })

    const retainQuery = useCallback(
      (excludeArtworkIds: string[]) => {
        const queryRequest = getRequest(infiniteDiscoveryQuery)
        const descriptor = createOperationDescriptor(queryRequest, { excludeArtworkIds })
        const disposable = env.retain(descriptor)
        queriesForDisposal.current.push(disposable)
        usedExcludeArtworkIds.current.push(excludeArtworkIds)
      },
      [env]
    )

    const requestMoreForColumn = useCallback(() => {
      fetchQueueRef.current = fetchQueueRef.current.then(async () => {
        const excludeArtworkIds = excludeArtworkIdsRef.current

        try {
          const response = await fetchQuery<InfiniteDiscoveryQueryRendererQuery>(
            env,
            infiniteDiscoveryQuery,
            { excludeArtworkIds },
            { fetchPolicy: "network-only" }
          ).toPromise()

          const fetchedArtworks = extractNodes(response?.discoverArtworks)
          const newArtworks = fetchedArtworks.filter((a) => !allArtworkIdsRef.current.has(a.internalID))

          if (newArtworks.length === 0) {
            return
          }

          newArtworks.forEach((a) => allArtworkIdsRef.current.add(a.internalID))

          excludeArtworkIdsRef.current = excludeArtworkIds
            .concat(newArtworks.map((a) => a.internalID))
            .slice(-MAX_EXCLUDE_ARTWORK_IDS)

          const offset = roundRobinOffsetRef.current
          roundRobinOffsetRef.current = offset + newArtworks.length
          setColumns((previousColumns) => distributeRoundRobin(previousColumns, newArtworks, undefined, offset))
          retainQuery(excludeArtworkIds)
        } catch (error) {
          addBreadcrumb({ message: "InfiniteExplorer failed to fetch more artworks" })
          captureException(error)
        }
      })
    }, [env, retainQuery])

    useEffect(() => {
      retainQuery(infiniteDiscoveryVariables.excludeArtworkIds)

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
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <Flex flex={1}>
        <InfiniteExplorer
          columns={columns}
          columnWidth={columnWidth}
          requestMoreForColumn={requestMoreForColumn}
        />
      </Flex>
    )
  },
  LoadingFallback: InfiniteDiscoverySpinner,
  ErrorFallback: () => (
    <Screen>
      <Screen.Body fullwidth>
        <LoadFailureView />
      </Screen.Body>
    </Screen>
  ),
})
