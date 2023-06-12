import { OwnerType } from "@artsy/cohesion"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { action, Action, createContextStore } from "easy-peasy"

interface SavedSearchModel {
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
  entity: SavedSearchEntity
  dirty: boolean

  setValueToAttributesByKeyAction: Action<
    this,
    {
      key: SearchCriteria
      value: string | number | boolean
    }
  >
  removeValueFromAttributesByKeyAction: Action<
    this,
    {
      key: SearchCriteria
      value: string | number | boolean
    }
  >
}

export const savedSearchModel: SavedSearchModel = {
  attributes: {},
  aggregations: [],
  dirty: false,
  entity: {
    placeholder: "",
    artists: [],
    owner: {
      type: OwnerType.artist,
      id: "",
      slug: "",
    },
  },

  setValueToAttributesByKeyAction: action((state, payload) => {
    // set form dirty on price update
    if (payload.key === "priceRange" && state.attributes[payload.key] !== payload.value) {
      state.dirty = true
    }

    //@ts-ignore
    state.attributes[payload.key] = payload.value
  }),

  removeValueFromAttributesByKeyAction: action((state, payload) => {
    const prevValue = state.attributes[payload.key]

    if (Array.isArray(prevValue)) {
      ;(state.attributes[payload.key] as string[]) = prevValue.filter(
        (value) => value !== payload.value
      )
    } else {
      state.attributes[payload.key] = null
    }

    state.dirty = true
  }),
}

export const SavedSearchStore = createContextStore<SavedSearchModel>(
  (initialData) => ({
    ...savedSearchModel,
    ...initialData,
  }),
  { name: "SavedSearchStore" }
)
export const SavedSearchStoreProvider = SavedSearchStore.Provider
