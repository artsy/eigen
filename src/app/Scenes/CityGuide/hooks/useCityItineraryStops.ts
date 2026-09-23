import { useCityItineraryStopsAddMutation } from "__generated__/useCityItineraryStopsAddMutation.graphql"
import { useCityItineraryStopsCreateItineraryMutation } from "__generated__/useCityItineraryStopsCreateItineraryMutation.graphql"
import { useCityItineraryStopsCreateSectionMutation } from "__generated__/useCityItineraryStopsCreateSectionMutation.graphql"
import { useCityItineraryStopsLookupQuery } from "__generated__/useCityItineraryStopsLookupQuery.graphql"
import { useCityItineraryStopsRemoveMutation } from "__generated__/useCityItineraryStopsRemoveMutation.graphql"
import { refetchCityGuideItinerariesRail } from "app/Scenes/CityGuide/utils/CityGuideItinerariesRailQuery"
import { fetchItinerarySections } from "app/Scenes/CityGuide/utils/fetchItinerarySections"
import { DateTime } from "luxon"
import { useCallback, useRef } from "react"
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay"
import { Environment, commitMutation } from "relay-runtime"

/**
 * What a stop points at, matching `ItineraryStopItemType`. A gallery or museum is a
 * `LOCATION`: the schema used to say `PARTNER`, but a stop names the place, and its partner is
 * reached through `Location.partner`.
 */
export type CityItineraryItemType = "SHOW" | "FAIR" | "LOCATION"

interface EntityStopInput {
  itemType: CityItineraryItemType
  itemID: string
  /** The itinerary stop this entity came from, so Gravity can copy its processed image. */
  sourceStopID?: string
  sourceShareToken?: string
  /** The editorial title. Falls back to the entity's own name server-side when absent. */
  title?: string
}

/**
 * A stop with no Artsy entity — a cafe, a landmark. `createItineraryStopInput` leaves
 * `itemType` and `itemID` optional, so these fields alone make a stop.
 *
 * A source stop ID lets Gravity copy its processed image without another upload.
 */
export interface CustomStopInput {
  itemType?: undefined
  isOnMyItineraries?: boolean | null
  myItineraries?: readonly { readonly internalID: string }[] | null
  sourceStopID?: string
  sourceShareToken?: string
  title: string
  address?: string
  note?: string
  sourceURL?: string
  category?:
    | "MUSEUM"
    | "GALLERY"
    | "SHOW"
    | "FAIR"
    | "CAFE"
    | "RESTAURANT"
    | "BAR"
    | "HOTEL"
    | "SHOP"
    | "PARK"
    | "LANDMARK"
    | "OTHER"
  isFreeAdmission?: boolean
  latitude?: number
  longitude?: number
}

export type StopInput = EntityStopInput | CustomStopInput

/**
 * Every stop the app adds goes here. Nothing can create a section yet, so one name for all of
 * them keeps a user's own stops together rather than scattered through a copied guide's days.
 */
export const MY_STOPS_SECTION = "My Stops"

/**
 * Whether this is that section — matched loosely, since the name is a plain string Gravity
 * stores verbatim, and a stop belongs in the section the user already has rather than in a
 * second one that differs only in case.
 */
export const isMyStopsSection = (section: { readonly title?: string | null }) =>
  section.title?.trim().toLowerCase() === MY_STOPS_SECTION.toLowerCase()

/**
 * What a new itinerary is called: "London October 2026", or "October 2026" where no city is
 * known. It reads as a trip rather than a place, so a second visit does not collide with the
 * first.
 */
export const defaultItineraryTitle = (cityName?: string) => {
  const monthAndYear = DateTime.local().toFormat("MMMM yyyy")

  return cityName ? `${cityName} ${monthAndYear}` : monthAndYear
}

/** How a stop's `item` union member maps onto the item type the caller passes in. */
const ITEM_TYPENAMES: Record<CityItineraryItemType, string> = {
  SHOW: "Show",
  FAIR: "Fair",
  LOCATION: "Location",
}

/**
 * Promise wrapper around `commitMutation`. A GraphQL payload can carry errors alongside a 200,
 * so those reject too rather than resolving with a half-written result.
 */
export const mutate = <T extends { variables: any; response: any }>(
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

export interface ExistingStop {
  readonly internalID: string
  readonly title?: string | null
  readonly address?: string | null
  readonly item?: { readonly __typename: string; readonly internalID?: string } | null
}

/**
 * The stop for this input, if the itinerary already has one.
 *
 * An entity stop matches on what it points at. A custom stop has no id to compare, so it
 * matches on title and address — imperfect, but allowing silent duplicates is worse.
 */
export const findStop = <T extends ExistingStop>(stops: readonly T[], input: StopInput) => {
  if (input.itemType) {
    return stops.find(
      (candidate) =>
        candidate.item?.__typename === ITEM_TYPENAMES[input.itemType] &&
        candidate.item?.internalID === input.itemID
    )
  }

  return stops.find((candidate) => isSameCustomStop(candidate, input))
}

/**
 * Whether an existing stop is a copy of this custom one. Exported so a screen can show the
 * right state for its add control without restating the rule.
 */
export const isSameCustomStop = (
  candidate: Omit<ExistingStop, "internalID">,
  input: { title: string; address?: string }
) =>
  !candidate.item &&
  candidate.title === input.title &&
  (candidate.address ?? undefined) === input.address

/**
 * Adds and removes stops on the user's own itinerary for a city.
 *
 * Adding takes several round trips, because Metaphysics has no find-or-create: look up the
 * itinerary, read its sections (the listing carries none), create it if the user has none,
 * make sure it has a section (creating one is required — a new itinerary has none, and a stop
 * must belong to a section), then create the stop. Removing finds the stop from what it points
 * at, which is all a card knows about itself, then deletes it by id.
 *
 * A single in-flight promise per hook instance serialises calls: two quick taps would
 * otherwise each find no itinerary and create one, leaving the user with two.
 */
export const useCityItineraryStops = ({
  citySlug,
  cityName,
}: {
  citySlug: string
  /** Absent where no city is known, which leaves it out of a new itinerary's name. */
  cityName?: string
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
      let itineraryID = data?.me?.itinerariesConnection?.edges?.[0]?.node?.internalID
      const sections = itineraryID ? await fetchItinerarySections(environment, itineraryID) : []

      // Rather than carry on and add a second "My Stops" to an itinerary that already has one.
      if (!sections) throw new Error("Could not read that itinerary")

      // By name, not the first section: an itinerary copied from a guide arrives with the
      // guide's own days, and a stop the user adds belongs in theirs.
      let sectionID = sections.find(isMyStopsSection)?.internalID
      // Flattened across sections: a stop is on the itinerary or it is not, and which section
      // holds it does not matter for finding or removing one.
      const stops = sections.flatMap((section) => section.stops)

      if (!itineraryID) {
        if (!createIfMissing) return null

        const created = await mutate<useCityItineraryStopsCreateItineraryMutation>(
          environment,
          createItineraryMutation,
          { input: { citySlug, title: defaultItineraryTitle(cityName) } }
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
        if (!createIfMissing) return { itineraryID, sectionID: undefined, stops }

        const created = await mutate<useCityItineraryStopsCreateSectionMutation>(
          environment,
          createSectionMutation,
          { input: { itineraryID, title: MY_STOPS_SECTION } }
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

      return { itineraryID, sectionID, stops }
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

        // Adding the same entity twice is a no-op. Gravity has no uniqueness constraint on
        // (section, item type, item id) yet, so without this a second tap would leave two
        // identical stops on the itinerary.
        const already = findStop(target.stops, stop)

        if (already) return { itineraryID: target.itineraryID, stop: already }

        const created = await mutate<useCityItineraryStopsAddMutation>(
          environment,
          addStopMutation,
          { input: { itinerarySectionID: target.sectionID, ...stop } }
        )
        const response = created.createItineraryStop?.responseOrError

        if (response?.__typename !== "ItineraryStopMutationSuccess") {
          throw new Error(
            response?.__typename === "ItineraryStopMutationFailure"
              ? response.mutationError?.message ?? "Could not add the stop"
              : "Could not add the stop"
          )
        }

        refetchCityGuideItinerariesRail(environment, citySlug).catch(() => undefined)

        return { itineraryID: target.itineraryID, stop: response.itineraryStop }
      }),
    [serialise, resolveTarget, environment, citySlug]
  )

  const removeStop = useCallback(
    (stop: StopInput) =>
      serialise(async () => {
        // No itinerary means nothing to remove, and creating one to delete from would be absurd.
        const target = await resolveTarget(false)

        if (!target?.itineraryID) return null

        // `deleteItineraryStop` takes the stop's own id, which a card never has — it knows the
        // show or fair it renders. So the stop is found by what it points at. Nothing to
        // remove is success, not an error: the card already shows the state the user wanted.
        const existingStop = findStop(target.stops, stop)

        if (!existingStop) return null

        const removed = await mutate<useCityItineraryStopsRemoveMutation>(
          environment,
          removeStopMutation,
          { input: { id: existingStop.internalID } }
        )
        const response = removed.deleteItineraryStop?.responseOrError

        if (response?.__typename !== "ItineraryStopMutationSuccess") {
          throw new Error(
            response?.__typename === "ItineraryStopMutationFailure"
              ? response.mutationError?.message ?? "Could not remove the stop"
              : "Could not remove the stop"
          )
        }

        refetchCityGuideItinerariesRail(environment, citySlug).catch(() => undefined)

        return response.itineraryStop
      }),
    [serialise, resolveTarget, environment, citySlug]
  )

  return { addStop, removeStop }
}

// Only the id: the listing has no sections (see `fetchItinerarySections`), and selecting them
// here would write an empty list over the itinerary screen's own.
const lookupQuery = graphql`
  query useCityItineraryStopsLookupQuery($citySlug: String!) {
    me {
      itinerariesConnection(citySlug: $citySlug, first: 1) {
        edges {
          node {
            internalID
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
  mutation useCityItineraryStopsRemoveMutation($input: deleteItineraryStopInput!) {
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
