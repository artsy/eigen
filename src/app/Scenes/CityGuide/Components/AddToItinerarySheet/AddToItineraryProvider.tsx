import {
  AddToItinerarySheet,
  AddToItineraryTarget,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItinerarySheet"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

interface AddToItineraryContext {
  /** Opens the sheet for one entity. Absent outside a provider, which leaves the plus inert. */
  open: (target: AddToItineraryTarget) => void
}

const Context = createContext<AddToItineraryContext | null>(null)

/**
 * Holds the one Add to Itinerary sheet for a screen, so a list of twenty rows mounts one modal
 * rather than twenty. Every plus below it calls `open` with what it points at.
 *
 * The city is supplied here rather than per row: a screen knows which city it is showing, and
 * a row would have to thread it through every card.
 */
export const AddToItineraryProvider: React.FC<{
  citySlug?: string
  cityName?: string
  children: React.ReactNode
}> = ({ citySlug, cityName, children }) => {
  const [target, setTarget] = useState<AddToItineraryTarget | null>(null)

  const open = useCallback(
    (next: AddToItineraryTarget) => setTarget({ citySlug, cityName, ...next }),
    [citySlug, cityName]
  )

  const value = useMemo(() => ({ open }), [open])

  return (
    <Context.Provider value={value}>
      {children}

      <AddToItinerarySheet target={target} onClose={() => setTarget(null)} />
    </Context.Provider>
  )
}

/**
 * `null` where no provider is mounted. A caller renders no plus in that case rather than one
 * that does nothing when tapped.
 */
export const useAddToItinerary = () => useContext(Context)
