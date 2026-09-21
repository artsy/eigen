import { useApplyItinerarySelectionAddMutation } from "__generated__/useApplyItinerarySelectionAddMutation.graphql"
import { useApplyItinerarySelectionCreateSectionMutation } from "__generated__/useApplyItinerarySelectionCreateSectionMutation.graphql"
import { useApplyItinerarySelectionRemoveMutation } from "__generated__/useApplyItinerarySelectionRemoveMutation.graphql"
import {
  StopTarget,
  selectionChanges,
  stopMutationInput,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import {
  MY_STOPS_SECTION,
  findStop,
  isMyStopsSection,
  mutate,
} from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import {
  fetchItinerarySections,
  ItinerarySectionDetail,
} from "app/Scenes/CityGuide/utils/fetchItinerarySections"
import { useCallback } from "react"
import { graphql, useRelayEnvironment } from "react-relay"

/**
 * How many adds run at once, per destination itinerary. Sequential would be safe but slow — a
 * 20-stop guide added to 2 itineraries is 40 round trips, 10s+ behind a spinner otherwise.
 */
const ADD_CONCURRENCY = 5

/**
 * Applies the sheet's ticks: a newly ticked itinerary gains every target it doesn't already
 * hold, and — single-target mode only — a newly unticked one loses it. A row nobody touched is
 * left alone.
 *
 * One itinerary at a time rather than in parallel: each add may have to create a "My Stops"
 * section first, and a half-applied set is easier to reason about in order. Throws on the
 * first failure, so the sheet's own catch can tell the user something went wrong.
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

  /** The itinerary's "My Stops" section (created if it has none) and the stops it already holds. */
  const resolveDestination = useCallback(
    async (itineraryID: string) => {
      const { sections, stops } = await fetchStops(itineraryID)
      const existing = sections.find(isMyStopsSection)

      // Rather than carry on and add a second "My Stops" to an itinerary that already has one.
      if (existing) return { sectionID: existing.internalID, stops }

      const created = await mutate<useApplyItinerarySelectionCreateSectionMutation>(
        environment,
        CreateSectionMutation,
        { input: { itineraryID, title: MY_STOPS_SECTION } }
      )
      const response = created.createItinerarySection?.responseOrError

      if (response?.__typename !== "ItinerarySectionMutationSuccess") {
        throw new Error(
          response?.__typename === "ItinerarySectionMutationFailure"
            ? response.mutationError?.message ?? "Could not create a section"
            : "Could not create a section"
        )
      }

      const sectionID = response.itinerarySection?.internalID

      if (!sectionID) throw new Error("Could not create a section")

      return { sectionID, stops }
    },
    [fetchStops, environment]
  )

  /** Adds whichever of `targets` this destination doesn't already hold, `ADD_CONCURRENCY` at a time. */
  const addMissing = useCallback(
    async (
      destination: { sectionID: string; stops: ItinerarySectionDetail["stops"] },
      targets: readonly StopTarget[]
    ) => {
      const missing = targets.filter((target) => !findStop(destination.stops, target))

      for (let i = 0; i < missing.length; i += ADD_CONCURRENCY) {
        const chunk = missing.slice(i, i + ADD_CONCURRENCY)

        const results = await Promise.allSettled(
          chunk.map((target) =>
            mutate<useApplyItinerarySelectionAddMutation>(environment, AddMutation, {
              input: { itinerarySectionID: destination.sectionID, ...stopMutationInput(target) },
            })
          )
        )

        for (const result of results) {
          if (
            result.status !== "fulfilled" ||
            result.value.createItineraryStop?.responseOrError?.__typename !==
              "ItineraryStopMutationSuccess"
          ) {
            throw new Error("Could not add the stop")
          }
        }
      }
    },
    [environment]
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
        const destination = await resolveDestination(itineraryID)

        await addMissing(destination, targets)
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
       *  fetch `resolveDestination` uses for adds, rather than a second fetch of its own. */
      async function findStopIDByTarget(itineraryID: string, target: StopTarget) {
        const { stops } = await fetchStops(itineraryID)
        const stop = findStop(stops, target)

        return stop ? [stop.internalID] : []
      }
    },
    [environment, resolveDestination, addMissing, fetchStops]
  )
}

const CreateSectionMutation = graphql`
  mutation useApplyItinerarySelectionCreateSectionMutation($input: createItinerarySectionInput!) {
    createItinerarySection(input: $input) {
      responseOrError {
        __typename
        ... on ItinerarySectionMutationSuccess {
          itinerarySection {
            internalID
          }
        }
        ... on ItinerarySectionMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`

const AddMutation = graphql`
  mutation useApplyItinerarySelectionAddMutation($input: createItineraryStopInput!) {
    createItineraryStop(input: $input) {
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
