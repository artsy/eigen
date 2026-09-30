import { ActionType, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { AddIcon } from "@artsy/icons/native"
import {
  Button,
  Flex,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Text,
  useSpace,
} from "@artsy/palette-mobile"
import {
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetInternal,
} from "@gorhom/bottom-sheet"
import { AddToItinerarySheetCreateMutation } from "__generated__/AddToItinerarySheetCreateMutation.graphql"
import { AddToItinerarySheetQuery } from "__generated__/AddToItinerarySheetQuery.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useToast } from "app/Components/Toast/toastHook"
import {
  AddToItinerarySheetContext,
  SelectionState,
  SheetActions,
  useSheetContext,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheetContext"
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
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { useCallback, useLayoutEffect, useMemo, useState } from "react"
import { Platform } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"
import { useTracking } from "react-tracking"

/** Well above the number of itineraries a user has for one city. */
const PAGE_SIZE = 20
const ADD_ICON_SIZE = 16
const SNAP_POINTS = ["50%", "95%"]
const SKELETON_ROWS = 3

interface SheetSession {
  key: string | null
  selection: SelectionState | null
  isSaving: boolean
}

/** Fit the visible snap point, so the provider's button stays at the bottom of the sheet. */
const SheetContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { animatedLayoutState, animatedPosition } = useBottomSheetInternal()
  const style = useAnimatedStyle(() => {
    const { containerHeight, handleHeight } = animatedLayoutState.get()
    return {
      height: Math.max(0, containerHeight - animatedPosition.get() - Math.max(0, handleHeight)),
    }
  })

  return <Animated.View style={style}>{children}</Animated.View>
}

/** An Artsy entity or a custom stop — whatever the sheet was opened for. */
export type AddToItineraryTarget = StopTarget & {
  /** Absent where no city is known — the sheet then lists every itinerary. */
  citySlug?: string
  cityName?: string
  /** For `addedStopToItinerary`'s `context_owner_slug` only — never part of `StopInput`, so it
   *  is stripped out below rather than spread into a `createItineraryStopInput`. */
  itemSlug?: string
  /** The screen the sheet was opened from, for `tappedCreateItinerary`. Absent inside City
   *  Guide, where the event is reported against the city guide itself. */
  contextScreenOwnerType?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
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
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  ...target
}) => {
  const { selection: savedSelection, setSelection, actions } = useSheetContext()
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
      hasLocation: !target.sourceStopID && target.itemType === "LOCATION",
    },
    { fetchPolicy: "network-only" }
  )

  const memberships =
    data.sourceStop?.myItineraryStopMemberships ??
    data.sourceShow?.myItineraryStopMemberships ??
    data.sourceFair?.myItineraryStopMemberships ??
    data.sourceLocation?.myItineraryStopMemberships ??
    null
  const fetchedItineraries = extractNodes(data.me?.itinerariesConnection).filter(
    (itinerary) => !itinerary.isCurated
  )
  // `createItineraryInput.citySlug` is required, so an itinerary cannot be made without a
  // city at all — a custom stop, or an entity with no City Guide city nearby.
  const canCreate = !!citySlug

  // Which rows open ticked: the itineraries the entity's memberships (or, failing those, the
  // stop it came from) say already hold it, kept to the ones actually listed.
  const holdingIDs =
    memberships?.map(({ itineraryID }) => itineraryID) ??
    myItineraries?.map(({ internalID }) => internalID) ??
    []
  const initial =
    savedSelection?.initial ??
    holdingIDs.filter((id) => fetchedItineraries.some((itinerary) => itinerary.internalID === id))
  const selected = savedSelection?.selected ?? initial
  const [isCreating, setIsCreating] = useState(false)
  const [isNaming, setIsNaming] = useState(false)

  const space = useSpace()
  // `create` mutates straight through the store, not through this screen's own
  // `useLazyLoadQuery`, so the itinerary it makes has to be added here by hand — otherwise it
  // neither shows in the list nor is findable by `applySelection` when Done is pressed.
  const createdItineraries = savedSelection?.createdItineraries ?? []
  const itineraries: PayloadItinerary[] = [...fetchedItineraries, ...createdItineraries]
  // A user with no itineraries has nothing to tick, so Done means "make me one" instead —
  // still something to do, even with nothing selected.
  const canAutoCreate = !itineraries.length && canCreate

  const toggle = (id: string) => {
    setSelection((saved) => {
      const current = saved ?? { initial, selected, createdItineraries, canAutoCreate }
      return {
        ...current,
        selected: current.selected.includes(id)
          ? current.selected.filter((each) => each !== id)
          : [...current.selected, id],
      }
    })
  }

  const create = async (title: string) => {
    setIsCreating(true)
    // Closing the form while the keyboard is still up makes both animate at once and stutter,
    // so the keyboard goes down while the mutation runs and the switch waits for it.
    const keyboardHidden = KeyboardController.dismiss()

    try {
      const created = await mutate<AddToItinerarySheetCreateMutation>(
        environment,
        CreateMutation,
        // Guarded by `canCreate`, which is what gates this whole view.
        {
          input: {
            citySlug: citySlug as string,
            title,
            authorName: data.me?.name?.trim() || undefined,
          },
        }
      )
      const response = created.createItinerary?.responseOrError
      const internalID =
        response?.__typename === "ItineraryMutationSuccess"
          ? response.itinerary?.internalID
          : undefined

      if (!internalID) throw new Error("Could not create the itinerary")

      // A brand new itinerary has no stops and no section yet — `applySelection` creates the
      // section itself when it finds none, same as it does for any other itinerary.
      // Ticked straight away, so Done adds the stop to what you just made.
      setSelection((saved) => {
        const current = saved ?? { initial, selected, createdItineraries, canAutoCreate }
        return {
          ...current,
          canAutoCreate: false,
          createdItineraries: [
            ...current.createdItineraries,
            { internalID, title, stopsCount: 0, heroImage: null },
          ],
          selected: [...current.selected, internalID],
        }
      })
      await keyboardHidden
      setIsNaming(false)
    } catch {
      toast.show("Could not create that itinerary. Please try again.", "bottom")
    } finally {
      setIsCreating(false)
    }
  }

  /** One event however many itineraries the stop landed on — ticking several rows still
   *  lands on all of them in a single Done tap, not one tap per itinerary. */
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
    try {
      let addedItineraryID: string | undefined
      // Done means "make me one" — which is what `addStop` already does, including naming it
      // and its section (and refetching the rail itself).
      if (canAutoCreate) {
        // Always a membership change: `addStop` makes the one itinerary this stop now sits on.
        const { itineraryID } = await addStop(target)
        addedItineraryID = itineraryID
        onSaved?.()
        trackAddedStop([itineraryID])
      } else {
        const changes = await applySelection({ target, initial, selected, memberships })
        if (changes.added.length === 1 && changes.removed.length === 0) {
          addedItineraryID = changes.added[0]
        }

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

      const addedItineraryCitySlug =
        fetchedItineraries.find((itinerary) => itinerary.internalID === addedItineraryID)
          ?.citySlug ?? citySlug

      if (addedItineraryID && addedItineraryCitySlug) {
        toast.show("Added to your Itinerary", "bottom", {
          backgroundColor: "green100",
          cta: "View Itinerary",
          onPress: () =>
            navigate(`/city-guide/${addedItineraryCitySlug}/itinerary/${addedItineraryID}`),
          hideOnPress: true,
        })
      } else {
        toast.show("Changes Saved", "bottom", { backgroundColor: "green100" })
      }
      onClose()
    } catch {
      // Left open on failure: dismissing would claim the change stuck.
      toast.show("Something went wrong. Please try again.", "bottom")
    }
  }

  useLayoutEffect(() => {
    if (!savedSelection) {
      setSelection((current) => current ?? { initial, selected, createdItineraries, canAutoCreate })
    }
    actions.done = done
  })

  return (
    <>
      <BottomSheetView style={{ flex: 1 }}>
        <SheetHeader
          canCreate={canCreate}
          selectedCount={selected.length}
          onCreate={() => {
            trackCohesionEvent({
              action: ActionType.tappedCreateItinerary,
              context_screen_owner_type: contextScreenOwnerType ?? OwnerType.cityGuide,
              context_screen_owner_id: contextScreenOwnerId,
              context_screen_owner_slug: contextScreenOwnerType ? contextScreenOwnerSlug : citySlug,
            })
            setIsNaming(true)
          }}
        />

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

/** The part of the sheet that never waits on the network: the title and the create row. */
const SheetHeader: React.FC<{
  canCreate: boolean
  /** Absent while loading, when there is nothing to have selected yet. */
  selectedCount?: number
  onCreate?: () => void
}> = ({ canCreate, selectedCount, onCreate }) => (
  <>
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
            onPress={onCreate}
            accessibilityRole="button"
          >
            Create New Itinerary
          </Text>
        </Flex>
      ) : (
        <Flex />
      )}

      {selectedCount !== undefined && (
        <Text variant="xs" color="mono60">
          {`${selectedCount} selected`}
        </Text>
      )}
    </Flex>
  </>
)

/** The sheet is already open by the time the itineraries load, so the chrome it always has
 *  stays put and only the list is a placeholder; the rows then land without the sheet jumping. */
const LoadingSheet: React.FC<AddToItineraryTarget> = ({ citySlug }) => (
  <BottomSheetView style={{ flex: 1 }}>
    <SheetHeader canCreate={!!citySlug} />

    <Skeleton>
      <Flex testID="add-to-itinerary-skeleton" px={2} py={2}>
        {times(SKELETON_ROWS).map((index) => (
          <Flex key={index} flexDirection="row" alignItems="center" gap={1} p={1}>
            <SkeletonBox width={40} height={40} />

            <Flex flex={1} gap={0.5}>
              <SkeletonText variant="xs">London September 2026</SkeletonText>
              <SkeletonText variant="xs">3 stops</SkeletonText>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Skeleton>
  </BottomSheetView>
)

const SheetWithSuspense = withSuspense({
  Component: Sheet,
  LoadingFallback: LoadingSheet,
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
}> = ({ target, onClose, onSaved }) => {
  const { bottom } = useSafeAreaInsets()
  const targetKey = target ? sheetTargetKey(target) : null
  const [session, setSession] = useState<SheetSession>({
    key: targetKey,
    selection: null,
    isSaving: false,
  })
  // Reset before committing a different target; an effect could erase an early row tap.
  if (session.key !== targetKey) {
    setSession({ key: targetKey, selection: null, isSaving: false })
  }
  const actions = useMemo<SheetActions>(() => ({ key: targetKey, isSaving: false }), [targetKey])
  const setSelection = useCallback(
    (next: (current: SelectionState | null) => SelectionState) => {
      setSession((current) =>
        current.key === targetKey ? { ...current, selection: next(current.selection) } : current
      )
    },
    [targetKey]
  )
  const done = async () => {
    if (actions.key !== targetKey || actions.isSaving || !actions.done) return
    actions.isSaving = true
    setSession((current) => ({ ...current, isSaving: true }))
    try {
      await actions.done()
    } finally {
      actions.isSaving = false
      setSession((current) =>
        current.key === targetKey ? { ...current, isSaving: false } : current
      )
    }
  }
  const selection = session.key === targetKey ? session.selection : null
  const context = useMemo(
    () => ({ selection, setSelection, actions }),
    [selection, setSelection, actions]
  )
  const disabled =
    !selection ||
    (!selection.selected.length && !selection.initial.length && !selection.canAutoCreate)

  return (
    <AutomountedBottomSheetModal
      visible={!!target}
      name="AddToItinerary"
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      onDismiss={onClose}
    >
      <AddToItinerarySheetContext.Provider value={context}>
        <SheetContent>
          <Flex flex={1}>
            {!!target && (
              <SheetWithSuspense
                key={sheetTargetKey(target)}
                {...target}
                onClose={onClose}
                onSaved={onSaved}
              />
            )}
          </Flex>

          <Flex
            backgroundColor="mono0"
            style={{ paddingBottom: Platform.OS === "android" ? bottom : 0 }}
          >
            <Flex p={2}>
              <Button
                testID="add-to-itinerary-done"
                block
                disabled={disabled}
                loading={session.isSaving}
                onPress={done}
              >
                Done
              </Button>
            </Flex>
          </Flex>
        </SheetContent>
      </AddToItinerarySheetContext.Provider>
    </AutomountedBottomSheetModal>
  )
}

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
    $hasLocation: Boolean!
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
    sourceLocation: location(id: $itemID) @include(if: $hasLocation) {
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
      name
      itinerariesConnection(citySlug: $citySlug, first: $first) {
        edges {
          node {
            citySlug
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
