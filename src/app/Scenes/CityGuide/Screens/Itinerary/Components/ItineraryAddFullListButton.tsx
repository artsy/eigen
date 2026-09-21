import { ActionType, OwnerType } from "@artsy/cohesion"
import { Button } from "@artsy/palette-mobile"
import { ItineraryAddFullListButtonCopyMutation } from "__generated__/ItineraryAddFullListButtonCopyMutation.graphql"
import { ItineraryAddFullListButtonQuery } from "__generated__/ItineraryAddFullListButtonQuery.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { useEffect, useRef, useState } from "react"
import { graphql, useLazyLoadQuery, useMutation } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  /** Threaded through so the tracking event can attribute to a specific itinerary. */
  citySlug: string
  /** The itinerary's own id, which is what `copyItinerary` takes. */
  itineraryId: string
  /** The itinerary's own slug, for tracking only. */
  itinerarySlug?: string
  /** Checked against your own itineraries' titles, so a guide already copied shows as such. */
  title: string
}

const AddFullListButton: React.FC<Props> = ({ citySlug, itineraryId, itinerarySlug, title }) => {
  const toast = useToast()
  const { trackEvent } = useTracking<Schema.Entity>()
  const { trackEvent: trackCohesionEvent } = useTracking()
  const [commit] = useMutation<ItineraryAddFullListButtonCopyMutation>(CopyMutation)
  const [isCopying, setIsCopying] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const data = useLazyLoadQuery<ItineraryAddFullListButtonQuery>(Query, { citySlug })
  const alreadyOwned = extractNodes(data.me?.itinerariesConnection).some(
    (itinerary) => itinerary.title.trim().toLowerCase() === title.trim().toLowerCase()
  )

  // Guards against setting state or toasting after the screen has gone away.
  const isMounted = useRef(true)
  useEffect(
    () => () => {
      isMounted.current = false
    },
    []
  )

  if (isCopied || alreadyOwned) {
    return (
      <Button variant="outline" size="small" disabled longestText="Add Full List">
        Added
      </Button>
    )
  }

  const copy = () => {
    setIsCopying(true)

    // Fired at tap-time, alongside (not instead of) the legacy outcome tracking `settle`
    // does below: this button still does the old `copyItinerary` mutation, which #14110
    // will replace with the Add to Itinerary sheet — whoever finishes that PR needs to
    // carry this tap event over, since the outcome-based tracking below won't survive it.
    trackCohesionEvent({
      action: ActionType.tappedAddFullListToItinerary,
      context_screen_owner_type: OwnerType.cityGuideGuide,
      context_screen_owner_id: itineraryId,
      context_screen_owner_slug: itinerarySlug,
    })

    const settle = (didCopy: boolean, message: string) => {
      // Tracked whether or not the screen is still mounted: the tap happened and the mutation
      // ran. Only the UI below needs skipping once unmounted.
      trackEvent({
        action_name: Schema.ActionNames.TappedAddFullList,
        action_type: didCopy ? Schema.ActionTypes.Success : Schema.ActionTypes.Fail,
        owner_type: Schema.OwnerEntityTypes.CityGuide,
        owner_slug: citySlug,
        owner_id: itineraryId,
      })

      if (!isMounted.current) return

      setIsCopying(false)
      setIsCopied(didCopy)
      toast.show(message, "bottom")
    }

    commit({
      variables: { input: { id: itineraryId } },
      onCompleted: (data, errors) => {
        const response = data.copyItinerary?.responseOrError

        // A payload can carry errors alongside a 200, so those count as a failure too.
        if (errors?.length || response?.__typename !== "ItineraryMutationSuccess") {
          settle(
            false,
            response?.__typename === "ItineraryMutationFailure"
              ? response.mutationError?.message ?? "Could not copy this itinerary"
              : "Could not copy this itinerary"
          )
          return
        }

        settle(true, "Added to your itineraries")
      },
      onError: () => settle(false, "Could not copy this itinerary"),
    })
  }

  return (
    <Button
      testID="itinerary-add-full-list"
      variant="outline"
      size="small"
      loading={isCopying}
      onPress={copy}
      longestText="Add Full List"
    >
      Add Full List
    </Button>
  )
}

export const ItineraryAddFullListButton = withSuspense({
  Component: AddFullListButton,
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})

const Query = graphql`
  query ItineraryAddFullListButtonQuery($citySlug: String!) {
    me {
      itinerariesConnection(citySlug: $citySlug, first: 50) {
        edges {
          node {
            title
          }
        }
      }
    }
  }
`

const CopyMutation = graphql`
  mutation ItineraryAddFullListButtonCopyMutation($input: copyItineraryInput!) {
    copyItinerary(input: $input) {
      responseOrError {
        __typename
        ... on ItineraryMutationSuccess {
          itinerary {
            internalID
          }
        }
        ... on ItineraryMutationFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
