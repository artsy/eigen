import { useApplyItinerarySelectionAddMutation } from "__generated__/useApplyItinerarySelectionAddMutation.graphql"
import { useApplyItinerarySelectionCreateSectionMutation } from "__generated__/useApplyItinerarySelectionCreateSectionMutation.graphql"
import { useApplyItinerarySelectionRemoveMutation } from "__generated__/useApplyItinerarySelectionRemoveMutation.graphql"
import {
  StopTarget,
  selectionChanges,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import {
  MY_STOPS_SECTION,
  findStop,
  isMyStopsSection,
  mutate,
} from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { fetchItinerarySections } from "app/Scenes/CityGuide/utils/fetchItinerarySections"
import { useCallback } from "react"
import { graphql, useRelayEnvironment } from "react-relay"

/**
 * Applies the sheet's ticks: a newly ticked itinerary gains a stop, a newly unticked one loses
 * it, and a row nobody touched is left alone.
 *
 * One itinerary at a time rather than in parallel: each add may have to create a "My Stops"
 * section first, and a half-applied set is easier to reason about in order.
 */
export const useApplyItinerarySelection = () => {
  const environment = useRelayEnvironment()

  /** The itinerary's "My Stops" section, created if it has none. */
  const resolveSection = useCallback(
    async (itineraryID: string) => {
      const sections = await fetchItinerarySections(environment, itineraryID)

      // Rather than carry on and add a second "My Stops" to an itinerary that already has one.
      if (!sections) throw new Error("Could not read that itinerary")

      const existing = sections.find(isMyStopsSection)

      if (existing) return existing.internalID

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

      return sectionID
    },
    [environment]
  )

  return useCallback(
    async ({
      target,
      initial,
      selected,
      memberships,
    }: {
      target: StopTarget
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
        const itinerarySectionID = await resolveSection(itineraryID)

        const created = await mutate<useApplyItinerarySelectionAddMutation>(
          environment,
          AddMutation,
          { input: { itinerarySectionID, ...target } }
        )
        const response = created.createItineraryStop?.responseOrError

        if (response?.__typename !== "ItineraryStopMutationSuccess") {
          throw new Error(
            response?.__typename === "ItineraryStopMutationFailure"
              ? response.mutationError?.message ?? "Could not add the stop"
              : "Could not add the stop"
          )
        }
      }

      for (const itineraryID of removed) {
        const membership = memberships?.find((each) => each.itineraryID === itineraryID)
        const matchingStopIDs = membership?.stopIDs ?? []
        const stopIDs =
          target.sourceStopID && matchingStopIDs.includes(target.sourceStopID)
            ? [target.sourceStopID]
            : matchingStopIDs.length
              ? matchingStopIDs
              : await findStopIDByTarget(itineraryID)

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

      return { added: added.length, removed: removed.length }

      /** Without membership data, the stop is found by what it points at. */
      async function findStopIDByTarget(itineraryID: string) {
        const sections = (await fetchItinerarySections(environment, itineraryID)) ?? []
        const stop = findStop(
          sections.flatMap((section) => section.stops),
          target
        )

        return stop ? [stop.internalID] : []
      }
    },
    [environment, resolveSection]
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
