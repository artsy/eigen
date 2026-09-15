import { useApplyItinerarySelectionAddMutation } from "__generated__/useApplyItinerarySelectionAddMutation.graphql"
import { useApplyItinerarySelectionCreateSectionMutation } from "__generated__/useApplyItinerarySelectionCreateSectionMutation.graphql"
import { useApplyItinerarySelectionRemoveMutation } from "__generated__/useApplyItinerarySelectionRemoveMutation.graphql"
import {
  PayloadItinerary,
  StopTarget,
  findStopForTarget,
  selectionChanges,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import { MY_STOPS_SECTION, mutate } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
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
    async (itinerary: PayloadItinerary) => {
      const existing = itinerary.sections.find((section) => section.title === MY_STOPS_SECTION)

      if (existing) return existing.internalID

      const created = await mutate<useApplyItinerarySelectionCreateSectionMutation>(
        environment,
        CreateSectionMutation,
        { input: { itineraryID: itinerary.internalID, title: MY_STOPS_SECTION } }
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
      itineraries,
      target,
      initial,
      selected,
    }: {
      itineraries: readonly PayloadItinerary[]
      target: StopTarget
      initial: readonly string[]
      selected: readonly string[]
    }) => {
      const { added, removed } = selectionChanges(initial, selected)
      const byId = new Map(itineraries.map((itinerary) => [itinerary.internalID, itinerary]))

      for (const id of added) {
        const itinerary = byId.get(id)

        if (!itinerary) continue

        const itinerarySectionID = await resolveSection(itinerary)

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

      for (const id of removed) {
        const itinerary = byId.get(id)
        const stop = itinerary && findStopForTarget(itinerary, target)

        // Nothing to remove is success: the row already shows the state the user asked for.
        if (!stop) continue

        const deleted = await mutate<useApplyItinerarySelectionRemoveMutation>(
          environment,
          RemoveMutation,
          { input: { id: stop.internalID } }
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

      return { added: added.length, removed: removed.length }
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
