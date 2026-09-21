import {
  AddToItinerarySheet,
  AddToItineraryRequest,
  AddToItineraryTarget,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

interface AddToItineraryContext {
  /**
   * Opens the sheet for one entity, or — "Add Full List" — for every stop in a guide at once.
   * Bulk mode is add-only: see `AddToItinerarySheet` for why. Absent outside a provider, which
   * leaves the plus inert.
   */
  open: (target: AddToItineraryTarget | AddToItineraryTarget[]) => void
}

const Context = createContext<AddToItineraryContext | null>(null)

/**
 * Holds the one Add to Itinerary sheet for a screen, so a list of twenty rows mounts one modal
 * rather than twenty. Every plus below it calls `open` with what it points at.
 *
 * The city is supplied here rather than per row: a screen knows which city it is showing, and
 * a row would have to thread it through every card. A caller can still override it per target
 * (`CustomStopSaveControl` does), which wins over the provider's own.
 */
export const AddToItineraryProvider: React.FC<{
  citySlug?: string
  cityName?: string
  /** Called after Done actually changes something, so the screen showing this stop's
   *  membership (its own `isOnMyItineraries`) can refetch and stop showing a stale state. */
  onSaved?: () => void
  children: React.ReactNode
}> = ({ citySlug, cityName, onSaved, children }) => {
  const [request, setRequest] = useState<AddToItineraryRequest | null>(null)

  const open = useCallback(
    (next: AddToItineraryTarget | AddToItineraryTarget[]) => {
      const targets = Array.isArray(next) ? next : [next]
      const [firstTarget] = targets

      setRequest({
        // `citySlug`/`cityName` live on the request, not on each target — stripped here so
        // they can never end up spread into a mutation's `input` (see `stopMutationInput`).
        targets: targets.map(({ citySlug: _citySlug, cityName: _cityName, ...target }) => target),
        citySlug: firstTarget?.citySlug ?? citySlug,
        cityName: firstTarget?.cityName ?? cityName,
      })
    },
    [citySlug, cityName]
  )

  const value = useMemo(() => ({ open }), [open])

  return (
    <Context.Provider value={value}>
      {children}

      <AddToItinerarySheet request={request} onClose={() => setRequest(null)} onSaved={onSaved} />
    </Context.Provider>
  )
}

/**
 * `null` where no provider is mounted. A caller renders no plus in that case rather than one
 * that does nothing when tapped.
 */
export const useAddToItinerary = () => useContext(Context)
