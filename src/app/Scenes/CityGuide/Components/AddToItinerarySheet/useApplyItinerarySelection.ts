import { useApplyItinerarySelectionAddMutation } from "__generated__/useApplyItinerarySelectionAddMutation.graphql"
import { useApplyItinerarySelectionRemoveMutation } from "__generated__/useApplyItinerarySelectionRemoveMutation.graphql"
import {
  StopTarget,
  selectionChanges,
  stopMutationInput,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import { findStop, mutate } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { fetchItinerarySections } from "app/Scenes/CityGuide/utils/fetchItinerarySections"
import { useCallback } from "react"
import { graphql, useRelayEnvironment } from "react-relay"

/**
 * Applies the sheet's ticks: a newly ticked itinerary gains every target it doesn't already
 * hold, and — single-target mode only — a newly unticked one loses it. A row nobody touched is
 * left alone.
 *
 * One itinerary at a time rather than in parallel: a half-applied set is easier to reason about
 * in order. Throws on the first failure, so the sheet's own catch can tell the user something
 * went wrong.
 */
export const useApplyItinerarySelection = () => {
  const environment = useRelayEnvironment()

  /** The itinerary's stops, read straight off its sections. */
  const fetchStops = useCallback(
    async (itineraryID: string) => {
      const sections = await fetchItinerarySections(environment, itineraryID)

      if (!sections) throw new Error("Could not read that itinerary")

      return { sections, stops: sections.flatMap((section) => section.stops) }
    },
    [environment]
  )

  /**
   * Adds whichever of `targets` this itinerary doesn't already hold, in one `addItineraryStops`
   * call. Gravity resolves or creates the itinerary's own "My Stops" section, and has no
   * dedupe of its own, so skipping what's already there is still done here.
   */
  const addMissing = useCallback(
    async (itineraryID: string, targets: readonly StopTarget[]) => {
      const { stops } = await fetchStops(itineraryID)
      const missing = targets.filter((target) => !findStop(stops, target))

      if (!missing.length) return

      const added = await mutate<useApplyItinerarySelectionAddMutation>(environment, AddMutation, {
        input: { itineraryID, stops: missing.map(stopMutationInput) },
      })

      if (
        added.addItineraryStops?.responseOrError?.__typename !== "AddItineraryStopsMutationSuccess"
      ) {
        throw new Error("Could not add the stops")
      }
    },
    [environment, fetchStops]
  )

  return useCallback(
    async ({
      targets,
      initial,
      selected,
      memberships,
    }: {
      targets: readonly StopTarget[]
      initial: readonly string[]
      selected: readonly string[]
      memberships?:
        | readonly {
            readonly itineraryID: string
            readonly stopIDs: readonly string[]
          }[]
        | null
    }) => {
      const { added, removed } = selectionChanges(initial, selected)

      for (const itineraryID of added) {
        await addMissing(itineraryID, targets)
      }

      // Bulk mode (>1 target) never pre-ticks anything, so `initial` is always `[]` there and
      // `removed` is always empty — this loop only ever runs for a single target. Guarded
      // explicitly anyway: a bulk untick must never delete, even if that invariant slips.
      if (targets.length === 1) {
        const [target] = targets

        for (const itineraryID of removed) {
          const membership = memberships?.find((each) => each.itineraryID === itineraryID)
          const matchingStopIDs = membership?.stopIDs ?? []
          const stopIDs =
            target.sourceStopID && matchingStopIDs.includes(target.sourceStopID)
              ? [target.sourceStopID]
              : matchingStopIDs.length
                ? matchingStopIDs
                : await findStopIDByTarget(itineraryID, target)

          // Nothing to remove is success: the row already shows the state the user asked for.
          if (!stopIDs.length) continue

          for (const stopID of stopIDs) {
            const deleted = await mutate<useApplyItinerarySelectionRemoveMutation>(
              environment,
              RemoveMutation,
              { input: { id: stopID } }
            )
            const response = deleted.deleteItineraryStop?.responseOrError

            if (response?.__typename !== "ItineraryStopMutationSuccess") {
              throw new Error(
                response?.__typename === "ItineraryStopMutationFailure"
                  ? response.mutationError?.message ?? "Could not remove the stop"
                  : "Could not remove the stop"
              )
            }
          }
        }
      }

      return { added, removed }

      /** Without membership data, the stop is found by what it points at — reusing the same
       *  fetch `addMissing` uses for dedupe, rather than a second fetch of its own. */
      async function findStopIDByTarget(itineraryID: string, target: StopTarget) {
        const { stops } = await fetchStops(itineraryID)
        const stop = findStop(stops, target)

        return stop ? [stop.internalID] : []
      }
    },
    [environment, addMissing, fetchStops]
  )
}

const AddMutation = graphql`
  mutation useApplyItinerarySelectionAddMutation($input: addItineraryStopsInput!) {
    addItineraryStops(input: $input) {
      responseOrError {
        __typename
        ... on AddItineraryStopsMutationSuccess {
          stops {
            internalID
          }
        }
        ... on AddItineraryStopsMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

const RemoveMutation = graphql`
  mutation useApplyItinerarySelectionRemoveMutation($input: deleteItineraryStopInput!) {
    deleteItineraryStop(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryStopMutationSuccess {
          itineraryStop {
            internalID
          }
        }
        ... on ItineraryStopMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
