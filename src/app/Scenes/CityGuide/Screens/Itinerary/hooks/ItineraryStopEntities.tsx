import {
  ItinerarySaveTarget,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

export interface ItineraryStopEntity {
  stopId: string
  /** Relay node id, used for optimistic store updates. */
  id: string
  internalID: string
  isFollowed: boolean
  type: ItinerarySaveTarget["type"]
}

type LookupStatus = "pending" | "resolved" | "failed"

interface Lookup {
  status: LookupStatus
  entity?: ItineraryStopEntity
}

export interface ItineraryStopEntitiesState {
  /** Only the resolved ones. */
  entities: ItineraryStopEntity[]
  expectedCount: number
  failedCount: number
  /** stopIds whose lookup failed, for surfacing which stops couldn't be added. */
  failedStopIds: string[]
  /** Every expected lookup has settled, one way or the other. */
  isSettled: boolean
  /** Every expected lookup resolved. The only state in which bulk-add is actionable. */
  isComplete: boolean
}

interface ContextValue {
  lookups: Record<string, Lookup>
  report: (entity: ItineraryStopEntity) => void
  reportFailure: (stopId: string) => void
}

const Context = createContext<ContextValue>({
  lookups: {},
  report: () => undefined,
  reportFailure: () => undefined,
})

const saveableStopIds = (stops: ItineraryStop[]) =>
  stops.filter((stop) => !!stop.saveTarget).map((stop) => stop.id)

/**
 * Holds one lookup per saveable stop, keyed by `stopId`, seeded as `pending` from `stops`
 * before any query runs.
 *
 * Seeding up front is the whole point. A provider that only held what had reported let the
 * first resolver make bulk-add actionable while the rest were still in flight, so pressing it
 * followed a partial set while claiming to add the full list.
 */
export const ItineraryStopEntitiesProvider: React.FC<{
  stops: ItineraryStop[]
  children: React.ReactNode
}> = ({ stops, children }) => {
  // Seeded once, from `stops` as passed on first render: the initializer runs only on mount, so
  // this implies no ongoing dependency on `stops`. `stops` comes from a static mock keyed by
  // itinerary id, and the screen remounts rather than swapping itineraries in place, so the
  // expected set never changes for a given mount. Do not add a reseeding effect: it would
  // clobber entities that have already reported. If itineraries ever become switchable in
  // place, key the provider on the itinerary id instead so React remounts it.
  const [lookups, setLookups] = useState<Record<string, Lookup>>(() =>
    Object.fromEntries(
      saveableStopIds(stops).map((id) => [id, { status: "pending" as LookupStatus }])
    )
  )

  const report = useCallback((entity: ItineraryStopEntity) => {
    setLookups((current) => {
      const existing = current[entity.stopId]

      // Bail out when nothing changed, so a reporting effect cannot loop.
      if (
        existing?.status === "resolved" &&
        existing.entity?.id === entity.id &&
        existing.entity?.internalID === entity.internalID &&
        existing.entity?.isFollowed === entity.isFollowed &&
        existing.entity?.type === entity.type
      ) {
        return current
      }

      return { ...current, [entity.stopId]: { status: "resolved", entity } }
    })
  }, [])

  const reportFailure = useCallback((stopId: string) => {
    setLookups((current) =>
      current[stopId]?.status === "failed"
        ? current
        : { ...current, [stopId]: { status: "failed" } }
    )
  }, [])

  const value = useMemo(
    () => ({ lookups, report, reportFailure }),
    [lookups, report, reportFailure]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

/** One stop's entity, or undefined while its lookup is pending or has failed. */
export const useItineraryStopEntity = (stopId: string): ItineraryStopEntity | undefined =>
  useContext(Context).lookups[stopId]?.entity

/** Contents plus completeness. Bulk-add must read `isComplete`, never just `entities`. */
export const useItineraryStopEntitiesState = (): ItineraryStopEntitiesState => {
  const { lookups } = useContext(Context)

  return useMemo(() => {
    const all = Object.values(lookups)
    const entities = all
      .map((lookup) => lookup.entity)
      .filter((entity): entity is ItineraryStopEntity => !!entity)

    return {
      entities,
      expectedCount: all.length,
      failedCount: all.filter((lookup) => lookup.status === "failed").length,
      failedStopIds: Object.entries(lookups)
        .filter(([, lookup]) => lookup.status === "failed")
        .map(([stopId]) => stopId),
      isSettled: all.every((lookup) => lookup.status !== "pending"),
      isComplete: all.length > 0 && all.every((lookup) => lookup.status === "resolved"),
    }
  }, [lookups])
}

/** Used only by the resolvers. */
export const useReportItineraryStopEntity = () => {
  const { report, reportFailure } = useContext(Context)

  return { report, reportFailure }
}
