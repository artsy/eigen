import { PayloadItinerary } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import { createContext, useContext } from "react"

export interface SelectionState {
  initial: string[]
  selected: string[]
  createdItineraries: PayloadItinerary[]
  canAutoCreate: boolean
}

export interface SheetActions {
  key: string | null
  done?: () => Promise<void>
  isSaving: boolean
}

export const AddToItinerarySheetContext = createContext<{
  selection: SelectionState | null
  setSelection: (next: (current: SelectionState | null) => SelectionState) => void
  actions: SheetActions
} | null>(null)

export const useSheetContext = () => {
  const context = useContext(AddToItinerarySheetContext)
  if (!context) throw new Error("Add to itinerary content requires its sheet provider")
  return context
}
