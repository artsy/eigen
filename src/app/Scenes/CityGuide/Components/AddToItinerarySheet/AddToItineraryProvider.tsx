import { ActionType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { AddToItineraryProviderLookupQuery } from "__generated__/AddToItineraryProviderLookupQuery.graphql"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { useToast } from "app/Components/Toast/toastHook"
import {
  AddToItinerarySheet,
  AddToItineraryTarget,
  screenOwnerFields,
  stopOwnerFields,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet"
import { CreateItineraryForm } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/components/CreateItineraryForm"
import {
  defaultItineraryTitle,
  useCityItineraryStops,
} from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay"
import { useTracking } from "react-tracking"

interface AddToItineraryContext {
  /** Opens the sheet for one entity. Absent outside a provider, which leaves the plus inert. */
  open: (target: AddToItineraryTarget) => void
  /** Whether the plus the user tapped for this entity is still being dealt with: its sheet is
   *  up, or it is being added without one. The plus stays in its pressed state until then,
   *  rather than springing back while the user is still in the middle of adding it. */
  isActive: (itemType: string, itemID: string) => boolean
}

const Context = createContext<AddToItineraryContext | null>(null)

/** What identifies an entity while it is being handled. A custom stop has no id to go by. */
const targetKey = (target: AddToItineraryTarget) =>
  target.itemType ? `${target.itemType}:${target.itemID}` : null

/**
 * Holds the one Add to Itinerary sheet for a screen, so a list of twenty rows mounts one modal
 * rather than twenty. Every plus below it calls `open` with what it points at.
 *
 * The city is supplied here rather than per row: a screen knows which city it is showing, and
 * a row would have to thread it through every card.
 *
 * A user with no itinerary for the city gets a single sheet instead of the list: "Add to New
 * Itinerary", with the name filled in. Create makes the itinerary and adds the stop in one go,
 * and a toast confirms it. Taps that land while that is still happening join it, rather than
 * each looking for an itinerary that does not exist yet.
 */
export const AddToItineraryProvider: React.FC<{
  citySlug?: string
  cityName?: string
  /** Set outside City Guide, so events from the sheet name the screen it was opened on. */
  contextScreenOwnerType?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  /** Called after Done actually changes something, so the screen showing this stop's
   *  membership (its own `isOnMyItineraries`) can refetch and stop showing a stale state. */
  onSaved?: () => void
  children: React.ReactNode
}> = ({
  citySlug,
  cityName,
  contextScreenOwnerType,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  onSaved,
  children,
}) => {
  const [target, setTarget] = useState<AddToItineraryTarget | null>(null)
  /** What the "Add to New Itinerary" sheet is open for: the user's first itinerary for the city. */
  const [naming, setNaming] = useState<AddToItineraryTarget | null>(null)
  const [addingKeys, setAddingKeys] = useState<readonly string[]>([])
  /** The same entities as `handling`, for the plus to show: between the tap and the sheet
   *  there is a lookup, and the plus would otherwise spring back for that moment. */
  const [handlingKeys, setHandlingKeys] = useState<readonly string[]>([])
  /** Entities whose tap is still being worked out, so a second tap on the same one is ignored. */
  const handling = useRef(new Set<string>())
  /** Quick adds running now. While there are any, the user's first itinerary may not exist yet
   *  for a lookup to find, so a tap joins them instead of asking. */
  const quickAddsRunning = useRef(0)
  const environment = useRelayEnvironment()
  const toast = useToast()
  const { trackEvent } = useTracking()
  const { addStop } = useCityItineraryStops({ citySlug: citySlug ?? "", cityName })

  /** Puts the stop on the user's itinerary for the city, creating the itinerary (under
   *  `itineraryTitle`, when given) if it has none. */
  const quickAdd = useCallback(
    async (next: AddToItineraryTarget, itineraryTitle?: string) => {
      const {
        citySlug: _citySlug,
        cityName: _cityName,
        isOnMyItineraries: _isOnMyItineraries,
        myItineraries: _myItineraries,
        itemSlug,
        contextScreenOwnerType: _type,
        contextScreenOwnerId: _id,
        contextScreenOwnerSlug: _slug,
        ...stop
      } = next
      const key = targetKey(next)

      quickAddsRunning.current += 1
      if (key) setAddingKeys((current) => [...current, key])

      try {
        const { itineraryID, createdItinerary } = await addStop(stop, itineraryTitle)

        onSaved?.()

        if (createdItinerary) {
          trackEvent({
            action: ActionType.createdItinerary,
            city_slug: citySlug ?? "",
            ...screenOwnerFields({
              citySlug,
              contextScreenOwnerType,
              contextScreenOwnerId,
              contextScreenOwnerSlug,
            }),
            owner_id: itineraryID,
            source: "firstSave",
          })
        }

        trackEvent({
          action: ActionType.addedStopToItinerary,
          ...stopOwnerFields(stop, itemSlug),
          owner_ids: [itineraryID],
        })

        toast.show("Added to your Itinerary", "bottom", {
          backgroundColor: "green100",
          cta: "View Itinerary",
          onPress: () => navigate(`/city-guide/${citySlug}/itinerary/${itineraryID}`),
          hideOnPress: true,
        })
      } finally {
        quickAddsRunning.current -= 1
        if (key) {
          setAddingKeys((current) => {
            const index = current.indexOf(key)
            return index < 0 ? current : current.filter((_, each) => each !== index)
          })
        }
      }
    },
    [
      addStop,
      citySlug,
      contextScreenOwnerId,
      contextScreenOwnerSlug,
      contextScreenOwnerType,
      onSaved,
      toast,
      trackEvent,
    ]
  )

  /** Whether the user has an itinerary of their own for the city. */
  const hasItinerary = useCallback(
    async (slug: string) => {
      const data = await fetchQuery<AddToItineraryProviderLookupQuery>(
        environment,
        LookupQuery,
        { citySlug: slug },
        // Never from cache: a stale "no itinerary" would create a second one.
        { fetchPolicy: "network-only" }
      ).toPromise()

      return extractNodes(data?.me?.itinerariesConnection).some((itinerary) => !itinerary.isCurated)
    },
    [environment]
  )

  const open = useCallback(
    async (next: AddToItineraryTarget) => {
      const merged: AddToItineraryTarget = {
        citySlug,
        cityName,
        contextScreenOwnerType,
        contextScreenOwnerId,
        contextScreenOwnerSlug,
        ...next,
      }
      const key = targetKey(merged)

      // A second tap on what is already being handled has nothing to add.
      if (key && handling.current.has(key)) return

      if (key) {
        handling.current.add(key)
        setHandlingKeys((current) => [...current, key])
      }

      try {
        // Already on an itinerary means the user came to move or remove it, which is the
        // sheet's job.
        const alreadyOnAnItinerary = !!merged.isOnMyItineraries || !!merged.myItineraries?.length

        if (merged.citySlug && !alreadyOnAnItinerary) {
          try {
            // The first itinerary is still being made, so there is nothing to ask about yet.
            if (quickAddsRunning.current > 0) {
              await quickAdd(merged)
              return
            }

            if (!(await hasItinerary(merged.citySlug))) {
              setNaming(merged)
              return
            }
          } catch {
            // Whatever went wrong, the sheet can still do the job.
          }
        }

        setTarget(merged)
      } finally {
        if (key) {
          handling.current.delete(key)
          // Batched with the `setTarget` / `setNaming` above, so the sheet takes over from this
          // without a render in between.
          setHandlingKeys((current) => current.filter((each) => each !== key))
        }
      }
    },
    [
      citySlug,
      cityName,
      contextScreenOwnerType,
      contextScreenOwnerId,
      contextScreenOwnerSlug,
      hasItinerary,
      quickAdd,
    ]
  )

  const isActive = useCallback(
    (itemType: string, itemID: string) => {
      const key = `${itemType}:${itemID}`

      return (
        addingKeys.includes(key) ||
        handlingKeys.includes(key) ||
        (!!naming && targetKey(naming) === key) ||
        (!!target && targetKey(target) === key)
      )
    },
    [addingKeys, handlingKeys, naming, target]
  )

  const value = useMemo(() => ({ open, isActive }), [open, isActive])

  /** Create was pressed: the sheet closes at once, and the card shows as added while it works. */
  const createFirstItinerary = (name: string) => {
    const pending = naming

    setNaming(null)

    if (!pending) return

    quickAdd(pending, name).catch(() =>
      toast.show("Could not create that itinerary. Please try again.", "bottom")
    )
  }

  return (
    <Context.Provider value={value}>
      {children}

      <AddToItinerarySheet target={target} onClose={() => setTarget(null)} onSaved={onSaved} />

      <AutoHeightBottomSheet
        visible={!!naming}
        name="CreateFirstItinerary"
        onDismiss={() => setNaming(null)}
      >
        <Flex mt={2}>
          <CreateItineraryForm
            title="Add to New Itinerary"
            initialName={defaultItineraryTitle(cityName)}
            isCreating={false}
            onCreate={createFirstItinerary}
          />
        </Flex>
      </AutoHeightBottomSheet>
    </Context.Provider>
  )
}

/**
 * `null` where no provider is mounted. A caller renders no plus in that case rather than one
 * that does nothing when tapped.
 */
export const useAddToItinerary = () => useContext(Context)

const LookupQuery = graphql`
  query AddToItineraryProviderLookupQuery($citySlug: String!) {
    me {
      itinerariesConnection(citySlug: $citySlug, first: 20) {
        edges {
          node {
            internalID
            isCurated
          }
        }
      }
    }
  }
`
