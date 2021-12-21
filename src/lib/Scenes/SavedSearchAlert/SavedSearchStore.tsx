import { action, Action, computed, Computed, createContextStore, State } from "easy-peasy"
import { Aggregations } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { extractPills } from "./pillExtractors"
import { SavedSearchPill } from "./SavedSearchAlertModel"

interface SavedSearchModel {
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
  dirty: boolean

  removeValueFromAttributesByKey: Action<
    this,
    {
      key: keyof SearchCriteriaAttributes
      value: string
    }
  >

  pills: Computed<this, SavedSearchPill[]>
}

export type SavedSearchState = State<SavedSearchModel>

const savedSearchModel: SavedSearchModel = {
  attributes: {},
  aggregations: [],
  dirty: false,

  removeValueFromAttributesByKey: action((state, payload) => {
    const prevValue = state.attributes[payload.key]
    let newValue = null

    if (Array.isArray(prevValue)) {
      newValue = prevValue.filter((value) => value !== payload.value)
    }

    state.attributes[payload.key] = newValue
    state.dirty = true
  }),

  pills: computed((state) => extractPills(state.attributes, state.aggregations)),
}

export const SavedSearchStore = createContextStore<SavedSearchModel>((initialData: SavedSearchModel) => ({
  ...savedSearchModel,
  ...initialData,
}))
export const SavedSearchStoreProvider = SavedSearchStore.Provider
