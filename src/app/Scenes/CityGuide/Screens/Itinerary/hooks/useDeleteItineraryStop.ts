import { useDeleteItineraryStopMutation } from "__generated__/useDeleteItineraryStopMutation.graphql"
import { mutate } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { refetchCityGuideItinerariesRail } from "app/Scenes/CityGuide/utils/CityGuideItinerariesRailQuery"
import { useCallback } from "react"
import { graphql, useRelayEnvironment } from "react-relay"

/**
 * Deletes a single stop by its own id. Unlike `useCityItineraryStops`'s `removeStop`, the
 * caller here already has the stop's id — it was just swiped — so no `findStop` lookup by
 * what it points at is needed.
 */
export const useDeleteItineraryStop = (citySlug: string) => {
  const environment = useRelayEnvironment()

  return useCallback(
    async (stopID: string) => {
      const result = await mutate<useDeleteItineraryStopMutation>(
        environment,
        deleteItineraryStopMutation,
        { input: { id: stopID } }
      )
      const response = result.deleteItineraryStop?.responseOrError

      if (response?.__typename !== "ItineraryStopMutationSuccess") {
        throw new Error(
          response?.__typename === "ItineraryStopMutationFailure"
            ? response.mutationError?.message ?? "Could not remove the stop"
            : "Could not remove the stop"
        )
      }

      refetchCityGuideItinerariesRail(environment, citySlug).catch(() => undefined)
    },
    [environment, citySlug]
  )
}

const deleteItineraryStopMutation = graphql`
  mutation useDeleteItineraryStopMutation($input: deleteItineraryStopInput!) {
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
