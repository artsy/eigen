import { MAX_SELECTED_WORKS } from "app/Scenes/Sell/constants"

/** Adds or removes a work, or returns null when adding it would go over the limit */
export const toggleWorkSelection = (selectedIDs: string[], internalID: string): string[] | null => {
  if (selectedIDs.includes(internalID)) {
    return selectedIDs.filter((id) => id !== internalID)
  }

  return selectedIDs.length < MAX_SELECTED_WORKS ? [...selectedIDs, internalID] : null
}
