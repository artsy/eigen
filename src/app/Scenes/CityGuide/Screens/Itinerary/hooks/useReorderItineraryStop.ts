import { useReorderItineraryStopMutation } from "__generated__/useReorderItineraryStopMutation.graphql"
import { mutate } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { useCallback } from "react"
import { graphql, useRelayEnvironment } from "react-relay"

/**
 * Reorders one stop within its own section via `updateItineraryStop`'s `position` field — the
 * schema doc confirms this is the only mutation for it ("There is no separate reposition
 * mutation for stops"), applied through `acts_as_list`'s `insert_at`, which is 1-indexed.
 *
 * There is no way to move a stop to a different section: `updateItineraryStopInput` carries no
 * section field, so cross-section drag is out of scope for what the API can do today.
 */
export const useReorderItineraryStop = () => {
  const environment = useRelayEnvironment()

  return useCallback(
    async (stopID: string, position: number) => {
      const result = await mutate<useReorderItineraryStopMutation>(
        environment,
        reorderItineraryStopMutation,
        { input: { id: stopID, position } }
      )
      const response = result.updateItineraryStop?.responseOrError

      if (response?.__typename !== "ItineraryStopMutationSuccess") {
        throw new Error(
          response?.__typename === "ItineraryStopMutationFailure"
            ? response.mutationError?.message ?? "Could not reorder the stop"
            : "Could not reorder the stop"
        )
      }
    },
    [environment]
  )
}

const reorderItineraryStopMutation = graphql`
  mutation useReorderItineraryStopMutation($input: updateItineraryStopInput!) {
    updateItineraryStop(input: $input) {
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
