import { ActionType, OwnerType } from "@artsy/cohesion"
import { AddIcon } from "@artsy/icons/native"
import { Button, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { BottomSheetFooter, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import { Portal, PortalHost } from "@gorhom/portal"
import { AddToItinerarySheetCreateMutation } from "__generated__/AddToItinerarySheetCreateMutation.graphql"
import { AddToItinerarySheetQuery } from "__generated__/AddToItinerarySheetQuery.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useToast } from "app/Components/Toast/toastHook"
import { AddToItineraryRow } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/components/AddToItineraryRow"
import { CreateItineraryForm } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/components/CreateItineraryForm"
import { useApplyItinerarySelection } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/useApplyItinerarySelection"
import {
  PayloadItinerary,
  StopTarget,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import {
  defaultItineraryTitle,
  mutate,
  useCityItineraryStops,
} from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { refetchCityGuideItinerariesRail } from "app/Scenes/CityGuide/utils/CityGuideItinerariesRailQuery"
import { itineraryStopsCount } from "app/Scenes/CityGuide/utils/itineraryStopsCount"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"
import { useTracking } from "react-tracking"

/** Well above the number of itineraries a user has for one city. */
const PAGE_SIZE = 20
const ADD_ICON_SIZE = 16
const SNAP_POINTS = ["50%", "95%"]
/**
 * `BottomSheetFooter` only gets the animated value it needs when rendered through
 * `BottomSheetModal`'s own `footerComponent` prop, which is outside `Sheet`'s own (suspended,
 * data-fetching) content — so the Done button, which needs `Sheet`'s state, can't be built
 * there directly. Instead `Sheet` portals the actual button into a host sitting inside that
 * footer, so it renders in the right place while still being driven by `Sheet`'s own state.
 */
const FOOTER_PORTAL_HOST = "add-to-itinerary-footer"

/** An Artsy entity or a custom stop — whatever the sheet was opened for. */
export type AddToItineraryTarget = StopTarget & {
  /** Absent where no city is known — the sheet then lists every itinerary. */
  citySlug?: string
  cityName?: string
  /** For `addedStopToItinerary`'s `context_owner_slug` only — never part of `StopInput`, so it
   *  is stripped out below rather than spread into a `createItineraryStopInput`. */
  itemSlug?: string
}

type Props = AddToItineraryTarget & {
  onClose: () => void
  /** Called after Done actually changes something, so the screen this sheet was opened from
   *  can refetch and stop showing a stale membership state. */
  onSaved?: () => void
}

const Sheet: React.FC<Props> = ({
  citySlug,
  cityName,
  onClose,
  onSaved,
  isOnMyItineraries: _isOnMyItineraries,
  myItineraries,
  itemSlug,
  ...target
}) => {
  const toast = useToast()
  const environment = useRelayEnvironment()
  const applySelection = useApplyItinerarySelection()
  const { trackEvent: trackCohesionEvent } = useTracking()
  // Only for the empty case: with no itineraries at all, Done creates one and adds the stop.
  const { addStop } = useCityItineraryStops({ citySlug: citySlug ?? "", cityName })

  const data = useLazyLoadQuery<AddToItinerarySheetQuery>(
    Query,
    {
      citySlug: citySlug ?? null,
      first: PAGE_SIZE,
      sourceStopID: target.sourceStopID ?? "",
      sourceShareToken: target.sourceShareToken ?? null,
      hasSourceStopID: !!target.sourceStopID,
      itemID: target.itemType ? target.itemID : "",
      hasShow: !target.sourceStopID && target.itemType === "SHOW",
      hasFair: !target.sourceStopID && target.itemType === "FAIR",
    },
    { fetchPolicy: "network-only" }
  )

  const memberships =
    data.sourceStop?.myItineraryStopMemberships ??
    data.sourceShow?.myItineraryStopMemberships ??
    data.sourceFair?.myItineraryStopMemberships ??
    null
  const fetchedItineraries = extractNodes(data.me?.itinerariesConnection).filter(
    (itinerary) => !itinerary.isCurated
  )
  // `createItineraryInput.citySlug` is required, so an itinerary cannot be made without a
  // city. Reached from outside City Guide you can only add to one you already have.
  const canCreate = !!citySlug

  // Which rows open ticked: the itineraries the entity's memberships (or, failing those, the
  // stop it came from) say already hold it, kept to the ones actually listed.
  const [initial] = useState(() => {
    const holdingIDs =
      memberships?.map(({ itineraryID }) => itineraryID) ??
      myItineraries?.map(({ internalID }) => internalID) ??
      []

    return holdingIDs.filter((id) =>
      fetchedItineraries.some((itinerary) => itinerary.internalID === id)
    )
  })
  const [selected, setSelected] = useState<string[]>(initial)
  const [isCreating, setIsCreating] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isNaming, setIsNaming] = useState(false)

  const space = useSpace()
  // `create` mutates straight through the store, not through this screen's own
  // `useLazyLoadQuery`, so the itinerary it makes has to be added here by hand — otherwise it
  // neither shows in the list nor is findable by `applySelection` when Done is pressed.
  const [createdItineraries, setCreatedItineraries] = useState<PayloadItinerary[]>([])
  const itineraries: PayloadItinerary[] = [...fetchedItineraries, ...createdItineraries]
  // A user with no itineraries has nothing to tick, so Done means "make me one" instead —
  // still something to do, even with nothing selected.
  const canAutoCreate = !itineraries.length && canCreate

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((each) => each !== id) : [...current, id]
    )

  const create = async (title: string) => {
    setIsCreating(true)

    try {
      const created = await mutate<AddToItinerarySheetCreateMutation>(
        environment,
        CreateMutation,
        // Guarded by `canCreate`, which is what gates this whole view.
        { input: { citySlug: citySlug as string, title } }
      )
      const response = created.createItinerary?.responseOrError
      const internalID =
        response?.__typename === "ItineraryMutationSuccess"
          ? response.itinerary?.internalID
          : undefined

      if (!internalID) throw new Error("Could not create the itinerary")

      // A brand new itinerary has no stops and no section yet — `applySelection` creates the
      // section itself when it finds none, same as it does for any other itinerary.
      setCreatedItineraries((current) => [
        ...current,
        { internalID, title, stopsCount: 0, heroImage: null },
      ])
      // Ticked straight away, so Done adds the stop to what you just made.
      setSelected((current) => [...current, internalID])
      setIsNaming(false)
    } catch {
      toast.show("Could not create that itinerary. Please try again.", "bottom")
    } finally {
      setIsCreating(false)
    }
  }

  /** One event however many itineraries the stop landed on — the bulk "Add Full List" case
   *  still lands on several itineraries in a single Done tap, not several taps. */
  const trackAddedStop = (ownerIDs: string[]) => {
    trackCohesionEvent({
      action: ActionType.addedStopToItinerary,
      context_owner_type: target.itemType
        ? STOP_OWNER_TYPE[target.itemType]
        : OwnerType.cityGuideCustomStop,
      context_owner_id: target.itemType ? target.itemID : undefined,
      context_owner_slug: target.itemType ? itemSlug : undefined,
      owner_ids: ownerIDs,
    })
  }

  const done = async () => {
    setIsApplying(true)

    try {
      // Done means "make me one" — which is what `addStop` already does, including naming it
      // and its section (and refetching the rail itself).
      if (canAutoCreate) {
        // Always a membership change: `addStop` makes the one itinerary this stop now sits on.
        const { itineraryID } = await addStop(target)
        onSaved?.()
        trackAddedStop([itineraryID])
      } else {
        const changes = await applySelection({ target, initial, selected, memberships })

        if (changes.added.length > 0 || changes.removed.length > 0) {
          onSaved?.()

          if (changes.added.length > 0) {
            trackAddedStop(changes.added)
          }

          if (citySlug) {
            refetchCityGuideItinerariesRail(environment, citySlug).catch(() => undefined)
          }
        }
      }

      toast.show("Changes Saved", "bottom")
      onClose()
    } catch {
      // Left open on failure: dismissing would claim the change stuck.
      toast.show("Something went wrong. Please try again.", "bottom")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <>
      <BottomSheetView style={{ flex: 1 }}>
        <Flex px={2} pb={2}>
          <Text variant="md">Add to Itinerary</Text>
        </Flex>

        <Flex px={2} flexDirection="row" alignItems="center" justifyContent="space-between">
          {canCreate ? (
            <Flex flexDirection="row" alignItems="center" gap={0.5}>
              <AddIcon width={ADD_ICON_SIZE} height={ADD_ICON_SIZE} />

              <Text
                testID="add-to-itinerary-create"
                variant="xs"
                onPress={() => {
                  trackCohesionEvent({
                    action: ActionType.tappedCreateItinerary,
                    context_screen_owner_type: OwnerType.cityGuide,
                    context_screen_owner_slug: citySlug,
                  })
                  setIsNaming(true)
                }}
                accessibilityRole="button"
              >
                Create New Itinerary
              </Text>
            </Flex>
          ) : (
            <Flex />
          )}

          <Text variant="xs" color="mono60">
            {`${selected.length} selected`}
          </Text>
        </Flex>

        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: space(2), paddingVertical: space(2) }}
          keyboardShouldPersistTaps="always"
        >
          {!itineraries.length && !canCreate && (
            <Text variant="xs" color="mono60">
              You have no itineraries yet. Start one from a city guide.
            </Text>
          )}

          {itineraries.map((itinerary) => (
            <AddToItineraryRow
              key={`${itinerary.internalID}`}
              title={itinerary.title}
              stopsCount={itineraryStopsCount(itinerary)}
              imageUrl={itinerary.heroImage?.url}
              selected={selected.includes(itinerary.internalID)}
              onPress={() => toggle(itinerary.internalID)}
            />
          ))}
        </BottomSheetScrollView>

        <Portal hostName={FOOTER_PORTAL_HOST}>
          <Flex p={2} backgroundColor="mono0">
            <Button
              testID="add-to-itinerary-done"
              block
              loading={isApplying}
              disabled={!selected.length && !initial.length && !canAutoCreate}
              onPress={done}
            >
              Done
            </Button>
          </Flex>
        </Portal>
      </BottomSheetView>

      <AutoHeightBottomSheet
        visible={isNaming}
        name="CreateItinerary"
        onDismiss={() => setIsNaming(false)}
      >
        <Flex mt={2}>
          <CreateItineraryForm
            initialName={defaultItineraryTitle(cityName)}
            isCreating={isCreating}
            onCreate={create}
            onCancel={() => setIsNaming(false)}
          />
        </Flex>
      </AutoHeightBottomSheet>
    </>
  )
}

const SheetWithSuspense = withSuspense({
  Component: Sheet,
  // The sheet is already open by the time this loads; a spinner inside it would be more
  // movement than the list appearing.
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})

/**
 * The sheet the plus opens: your itineraries, ticked where they already hold this entity.
 *
 * Selection is local until Done, as the artwork-lists sheet does it, so a user can tick and
 * untick without firing a mutation per tap.
 */
export const AddToItinerarySheet: React.FC<{
  target: AddToItineraryTarget | null
  onClose: () => void
  onSaved?: () => void
}> = ({ target, onClose, onSaved }) => (
  <AutomountedBottomSheetModal
    visible={!!target}
    name="AddToItinerary"
    snapPoints={SNAP_POINTS}
    enableDynamicSizing={false}
    onDismiss={onClose}
    footerComponent={({ animatedFooterPosition }) => (
      <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
        <PortalHost name={FOOTER_PORTAL_HOST} />
      </BottomSheetFooter>
    )}
  >
    {!!target && (
      <SheetWithSuspense
        key={sheetTargetKey(target)}
        {...target}
        onClose={onClose}
        onSaved={onSaved}
      />
    )}
  </AutomountedBottomSheetModal>
)

/** What the stop being added points at, for `addedStopToItinerary`'s `context_owner_type`. A
 *  custom stop has no Artsy entity, so it is tracked under its own City Guide owner type
 *  rather than left without one — the field is required. */
const STOP_OWNER_TYPE: Record<"SHOW" | "FAIR" | "LOCATION", OwnerType> = {
  SHOW: OwnerType.show,
  FAIR: OwnerType.fair,
  LOCATION: OwnerType.partner,
}

const sheetTargetKey = (target: AddToItineraryTarget) =>
  target.itemType
    ? `${target.itemType}:${target.itemID}`
    : `custom:${target.sourceStopID ?? target.title}:${target.address ?? ""}`

const Query = graphql`
  query AddToItinerarySheetQuery(
    $citySlug: String
    $first: Int!
    $sourceStopID: String!
    $sourceShareToken: String
    $hasSourceStopID: Boolean!
    $itemID: String!
    $hasShow: Boolean!
    $hasFair: Boolean!
  ) {
    sourceShow: show(id: $itemID) @include(if: $hasShow) {
      myItineraryStopMemberships {
        itineraryID
        stopIDs
      }
    }
    sourceFair: fair(id: $itemID) @include(if: $hasFair) {
      myItineraryStopMemberships {
        itineraryID
        stopIDs
      }
    }
    sourceStop: itineraryStop(id: $sourceStopID, shareToken: $sourceShareToken)
      @include(if: $hasSourceStopID) {
      myItineraryStopMemberships {
        itineraryID
        stopIDs
      }
    }

    me {
      itinerariesConnection(citySlug: $citySlug, first: $first) {
        edges {
          node {
            internalID
            title
            isCurated
            stopsCount

            heroImage {
              url(version: "small")
            }
            # No sections: the listing has none (see fetchItinerarySections), and selecting them
            # here would write an empty list over the itinerary screen's own.
          }
        }
      }
    }
  }
`

const CreateMutation = graphql`
  mutation AddToItinerarySheetCreateMutation($input: createItineraryInput!) {
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
