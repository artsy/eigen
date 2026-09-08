import { useCityItineraryStopsAddMutation } from "__generated__/useCityItineraryStopsAddMutation.graphql"
import { useCityItineraryStopsCreateItineraryMutation } from "__generated__/useCityItineraryStopsCreateItineraryMutation.graphql"
import { useCityItineraryStopsCreateSectionMutation } from "__generated__/useCityItineraryStopsCreateSectionMutation.graphql"
import { useCityItineraryStopsLookupQuery } from "__generated__/useCityItineraryStopsLookupQuery.graphql"
import { useCityItineraryStopsRemoveMutation } from "__generated__/useCityItineraryStopsRemoveMutation.graphql"
import { useCallback, useRef } from "react"
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay"
import { Environment, commitMutation } from "relay-runtime"

/** What a stop points at. `PARTNER` covers galleries and museums alike. */
export type CityItineraryItemType = "SHOW" | "FAIR" | "PARTNER"

interface StopInput {
  itemType: CityItineraryItemType
  itemID: string
  /** The editorial title. Falls back to the entity's own name server-side when absent. */
  title?: string
}

/**
 * Promise wrapper around `commitMutation`. A GraphQL payload can carry errors alongside a 200,
 * so those reject too rather than resolving with a half-written result.
 */
const mutate = <T extends { variables: any; response: any }>(
  environment: Environment,
  mutation: any,
  variables: T["variables"]
) =>
  new Promise<T["response"]>((resolve, reject) => {
    commitMutation<T>(environment, {
      mutation,
      variables,
      onCompleted: (response, errors) => {
        if (errors?.length) {
          reject(new Error(errors.map((error) => error.message).join(", ")))
          return
        }

        resolve(response)
      },
      onError: reject,
    })
  })

/**
 * Adds and removes stops on the user's own itinerary for a city.
 *
 * Adding takes three round trips, because Metaphysics has no find-or-create: look up the
 * itinerary, create it if the user has none, make sure it has a section (creating one is
 * required — a new itinerary has none, and a stop must belong to a section), then create the
 * stop. Removing takes one, since `removeItineraryStopByItem` resolves the stop from what it
 * points at, which is all a card knows about itself.
 *
 * A single in-flight promise per hook instance serialises calls: two quick taps would
 * otherwise each find no itinerary and create one, leaving the user with two.
 */
export const useCityItineraryStops = ({
  citySlug,
  cityName,
}: {
  citySlug: string
  /** The default itinerary's name is just the city's — "London", not "London Itinerary". */
  cityName: string
}) => {
  const environment = useRelayEnvironment()
  const inFlight = useRef<Promise<unknown>>(Promise.resolve())

  /** Resolves the itinerary's id and a section to put stops in, creating either if needed. */
  const resolveTarget = useCallback(
    async (createIfMissing: boolean) => {
      const data = await fetchQuery<useCityItineraryStopsLookupQuery>(
        environment,
        lookupQuery,
        { citySlug },
        // Never from cache: a stale "no itinerary" answer would create a second one.
        { fetchPolicy: "network-only" }
      ).toPromise()

      // The connection is the caller's own by definition, so the first is their itinerary for
      // this city. A user with several picks up the most recent, which is what Gravity orders
      // by; multiple personal itineraries per city are a later feature.
      const existing = data?.me?.itinerariesConnection?.edges?.[0]?.node

      let itineraryID = existing?.internalID
      let sectionID = existing?.sections?.[0]?.internalID

      if (!itineraryID) {
        if (!createIfMissing) return null

        const created = await mutate<useCityItineraryStopsCreateItineraryMutation>(
          environment,
          createItineraryMutation,
          { input: { citySlug, name: cityName } }
        )
        const response = created.createItinerary?.responseOrError

        itineraryID =
          response?.__typename === "ItineraryMutationSuccess"
            ? response.itinerary?.internalID
            : undefined

        if (!itineraryID) {
          throw new Error(
            response?.__typename === "ItineraryMutationFailure"
              ? response.mutationError?.message ?? "Could not create the itinerary"
              : "Could not create the itinerary"
          )
        }

        sectionID = undefined
      }

      if (!sectionID) {
        if (!createIfMissing) return { itineraryID, sectionID: undefined }

        // Named after the city, like the itinerary itself. The section exists only because a
        // stop must belong to one, and the UI shows a single list, so it needs no label of its
        // own — but a name reads better than a blank heading anywhere it does surface.
        const created = await mutate<useCityItineraryStopsCreateSectionMutation>(
          environment,
          createSectionMutation,
          { input: { itineraryID, title: cityName } }
        )
        const response = created.createItinerarySection?.responseOrError

        sectionID =
          response?.__typename === "ItinerarySectionMutationSuccess"
            ? response.itinerarySection?.internalID
            : undefined

        if (!sectionID) {
          throw new Error(
            response?.__typename === "ItinerarySectionMutationFailure"
              ? response.mutationError?.message ?? "Could not create a section"
              : "Could not create a section"
          )
        }
      }

      return { itineraryID, sectionID }
    },
    [environment, citySlug, cityName]
  )

  /** Queues `work` behind whatever is already running, so adds cannot interleave. */
  const serialise = useCallback(<T>(work: () => Promise<T>): Promise<T> => {
    const next = inFlight.current.then(work, work)

    // Swallowed only for the chain's own bookkeeping — the returned promise still rejects.
    inFlight.current = next.catch(() => undefined)

    return next
  }, [])

  const addStop = useCallback(
    (stop: StopInput) =>
      serialise(async () => {
        const target = await resolveTarget(true)

        if (!target?.sectionID) {
          throw new Error("Could not find a section to add the stop to")
        }

        const created = await mutate<useCityItineraryStopsAddMutation>(
          environment,
          addStopMutation,
          {
            input: {
              itinerarySectionID: target.sectionID,
              itemType: stop.itemType,
              itemID: stop.itemID,
              title: stop.title,
            },
          }
        )
        const response = created.createItineraryStop?.responseOrError

        if (response?.__typename !== "ItineraryStopMutationSuccess") {
          throw new Error(
            response?.__typename === "ItineraryStopMutationFailure"
              ? response.mutationError?.message ?? "Could not add the stop"
              : "Could not add the stop"
          )
        }

        return response.itineraryStop
      }),
    [serialise, resolveTarget, environment]
  )

  const removeStop = useCallback(
    (stop: Pick<StopInput, "itemType" | "itemID">) =>
      serialise(async () => {
        // No itinerary means nothing to remove, and creating one to delete from would be absurd.
        const target = await resolveTarget(false)

        if (!target?.itineraryID) return []

        const removed = await mutate<useCityItineraryStopsRemoveMutation>(
          environment,
          removeStopMutation,
          {
            input: {
              itineraryID: target.itineraryID,
              itemType: stop.itemType,
              itemID: stop.itemID,
            },
          }
        )
        const response = removed.removeItineraryStopByItem?.responseOrError

        if (response?.__typename !== "RemoveItineraryStopByItemSuccess") {
          throw new Error(
            response?.__typename === "RemoveItineraryStopByItemFailure"
              ? response.mutationError?.message ?? "Could not remove the stop"
              : "Could not remove the stop"
          )
        }

        return response.itineraryStops
      }),
    [serialise, resolveTarget, environment]
  )

  return { addStop, removeStop }
}

const lookupQuery = graphql`
  query useCityItineraryStopsLookupQuery($citySlug: String!) {
    me {
      itinerariesConnection(citySlug: $citySlug, first: 1) {
        edges {
          node {
            internalID
            sections {
              internalID
            }
          }
        }
      }
    }
  }
`

const createItineraryMutation = graphql`
  mutation useCityItineraryStopsCreateItineraryMutation($input: createItineraryInput!) {
    createItinerary(input: $input) {
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

const createSectionMutation = graphql`
  mutation useCityItineraryStopsCreateSectionMutation($input: createItinerarySectionInput!) {
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

const addStopMutation = graphql`
  mutation useCityItineraryStopsAddMutation($input: createItineraryStopInput!) {
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

const removeStopMutation = graphql`
  mutation useCityItineraryStopsRemoveMutation($input: removeItineraryStopByItemInput!) {
    removeItineraryStopByItem(input: $input) {
      responseOrError {
        __typename
        ... on RemoveItineraryStopByItemSuccess {
          itineraryStops {
            internalID
          }
        }
        ... on RemoveItineraryStopByItemFailure {
          mutationError {
            message
          }
        }
      }
    }
  }
`
