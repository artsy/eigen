import { Button, Text } from "@artsy/palette-mobile"
import { useFollowProfileMutation } from "__generated__/useFollowProfileMutation.graphql"
import { useFollowShowMutation } from "__generated__/useFollowShowMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import {
  ItineraryStopEntity,
  useItineraryStopEntitiesState,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { followProfileMutationConfig } from "app/utils/mutations/useFollowProfile"
import { followShowMutationConfig } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { useEffect, useRef, useState } from "react"
import { useRelayEnvironment } from "react-relay"
import { useTracking } from "react-tracking"
import { commitMutation, PayloadError } from "relay-runtime"

/** Bounded so a large itinerary does not fire dozens of simultaneous mutations. */
const MAX_CONCURRENT = 4

const follow = (environment: ReturnType<typeof useRelayEnvironment>, entity: ItineraryStopEntity) =>
  new Promise<boolean>((resolve) => {
    // A GraphQL payload can carry errors alongside a 200, so treat any error as a failure.
    const onCompleted = (_data: unknown, errors?: readonly PayloadError[] | null) =>
      resolve(!errors?.length)
    const onError = () => resolve(false)

    // The same configuration the hooks use, so the optimistic response and the store write are
    // identical and rows update as each mutation lands. Kept as two separate `commitMutation`
    // calls, rather than one call fed a union config, because TypeScript cannot infer a single
    // mutation shape from a config whose `mutation`/`optimisticResponse` differ by branch.
    if (entity.type === "SHOW") {
      const config = followShowMutationConfig({
        id: entity.id,
        internalID: entity.internalID,
        isFollowed: false,
      })

      commitMutation<useFollowShowMutation>(environment, {
        mutation: config.mutation,
        variables: config.variables,
        optimisticResponse: config.optimisticResponse,
        optimisticUpdater: config.optimisticUpdater,
        onCompleted,
        onError,
      })

      return
    }

    const config = followProfileMutationConfig({
      id: entity.id,
      internalID: entity.internalID,
      isFollowed: false,
    })

    commitMutation<useFollowProfileMutation>(environment, {
      mutation: config.mutation,
      variables: config.variables,
      optimisticResponse: config.optimisticResponse,
      optimisticUpdater: config.optimisticUpdater,
      onCompleted,
      onError,
    })
  })

/** Runs `task` over `items` with at most `limit` in flight. */
const mapWithLimit = async <T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = []

  for (let i = 0; i < items.length; i += limit) {
    results.push(...(await Promise.all(items.slice(i, i + limit).map(task))))
  }

  return results
}

interface ItineraryAddFullListButtonProps {
  /** Threaded through so the bulk-add tracking event can attribute to a specific itinerary. */
  citySlug: string
  itineraryId: string
}

export const ItineraryAddFullListButton: React.FC<ItineraryAddFullListButtonProps> = ({
  citySlug,
  itineraryId,
}) => {
  const environment = useRelayEnvironment()
  const toast = useToast()
  const { trackEvent } = useTracking<Schema.Entity>()
  const { entities, expectedCount, isSettled, isComplete } = useItineraryStopEntitiesState()
  const [isAdding, setIsAdding] = useState(false)

  // Guards against setting state or toasting after the screen has gone away.
  const isMounted = useRef(true)
  useEffect(
    () => () => {
      isMounted.current = false
    },
    []
  )

  // No saveable stops at all, so there is nothing this button could do.
  if (expectedCount === 0) {
    return null
  }

  // Still resolving. Rendered disabled rather than hidden so the layout does not jump, and
  // never actionable: pressing while incomplete would follow a partial set while the label
  // promises the full list.
  if (!isSettled) {
    return (
      <Button variant="outline" size="small" disabled longestText="Add Full List">
        Add Full List
      </Button>
    )
  }

  // Settled, but at least one entity could not be resolved, so "full list" is not deliverable.
  // No retry button: these lookups fail because a slug no longer resolves far more often than
  // from a transient error, so a retry would usually do nothing. Leaving and re-entering the
  // screen remounts the resolvers and tries again.
  //
  // Renders only the disabled button here — no explanatory sentence alongside it. This sits in
  // a `space-between` row next to the author byline (see `ItineraryHeader`), and a full sentence
  // has no natural width in a row like that: unconstrained, it can overflow or squeeze the
  // byline toward zero width. `ItineraryAddFullListStatus` renders the explanation as its own
  // full-width block below the row instead.
  if (!isComplete) {
    return (
      <Button variant="outline" size="small" disabled longestText="Add Full List">
        Add Full List
      </Button>
    )
  }

  const unsaved = entities.filter((entity) => !entity.isFollowed)

  if (unsaved.length === 0) {
    return (
      <Button variant="outline" size="small" disabled longestText="Add Full List">
        Added
      </Button>
    )
  }

  const addAll = async () => {
    setIsAdding(true)

    const results = await mapWithLimit(unsaved, MAX_CONCURRENT, (entity) =>
      follow(environment, entity)
    )

    const added = results.filter(Boolean).length

    trackEvent({
      action_name: Schema.ActionNames.TappedAddFullList,
      action_type: Schema.ActionTypes.Success,
      owner_type: Schema.OwnerEntityTypes.CityGuide,
      owner_slug: citySlug,
      owner_id: itineraryId,
      additional_properties: { attempted: unsaved.length, added },
    })

    // Checked after tracking, not before: the tap happened and the mutations ran regardless of
    // whether the screen is still mounted, so the analytics for that completed work should fire
    // either way. Only the UI updates below (toast, spinner) need to be skipped once unmounted.
    if (!isMounted.current) {
      return
    }

    setIsAdding(false)

    // On full success the label becomes "Added" on its own, because the store writes flow back
    // through the resolvers into the reported entities. Only the toast is reported here.
    toast.show(
      added === unsaved.length ? "Added to your saves" : `Added ${added} of ${unsaved.length}`,
      "bottom"
    )
  }

  return (
    <Button
      variant="outline"
      size="small"
      loading={isAdding}
      onPress={addAll}
      longestText="Add Full List"
    >
      Add Full List
    </Button>
  )
}

/**
 * The "N of M stops could not be loaded" explanation for `ItineraryAddFullListButton`'s
 * `!isComplete` state, split out so it can render as its own full-width block below the
 * author/button row instead of squeezed inside it (see the comment on that branch above).
 */
export const ItineraryAddFullListStatus: React.FC = () => {
  const { expectedCount, failedCount, isSettled, isComplete } = useItineraryStopEntitiesState()

  if (expectedCount === 0 || !isSettled || isComplete) {
    return null
  }

  return (
    <Text variant="xs" color="mono60" mt={0.5}>
      {`${failedCount} of ${expectedCount} stops could not be loaded, so the full list cannot be added.`}
    </Text>
  )
}
