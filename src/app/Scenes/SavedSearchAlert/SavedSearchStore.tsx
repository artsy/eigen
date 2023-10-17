import { OwnerType } from "@artsy/cohesion"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { Action, action, createContextStore } from "easy-peasy"
import { pick } from "lodash"

export interface SavedSearchModel {
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
  entity: SavedSearchEntity
  dirty: boolean
  /** Artwork ID, if the current saved search alert is being set from an artwork */
  currentArtworkID?: string

  setValueToAttributesByKeyAction: Action<
    this,
    {
      key: SearchCriteria
      value: string | string[] | boolean | null
    }
  >
  removeValueFromAttributesByKeyAction: Action<
    this,
    {
      key: SearchCriteria
      value: string | string[] | number | boolean
    }
  >
  clearAllAttributesAction: Action<this>
}

export const savedSearchModel: SavedSearchModel = {
  attributes: {},
  aggregations: [],
  dirty: false,
  entity: {
    artists: [],
    owner: {
      type: OwnerType.artist,
      id: "",
      slug: "",
    },
  },
  currentArtworkID: undefined,

  setValueToAttributesByKeyAction: action((state, payload) => {
    if (payload.key === "priceRange" && typeof payload.value === "string") {
      // set form dirty on price update
      if (state.attributes[payload.key] !== payload.value) {
        state.dirty = true
      }

      // set the price range to be null if the value is *-* (which means empty)
      state.attributes[payload.key] = payload.value === "*-*" ? null : payload.value
    } else {
      state.attributes[payload.key] = payload.value as unknown as null | undefined
    }
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

  clearAllAttributesAction: action((state) => {
    state.attributes = pick(state.attributes, ["artistIDs", "artistID"])
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
