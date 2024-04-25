import { OwnerType } from "@artsy/cohesion"
import {
  SavedSearchEntity,
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { PillPreview } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { Metric } from "app/Scenes/Search/UserPrefsModel"
import { Action, action, createContextStore } from "easy-peasy"
import { pick } from "lodash"

export interface SavedSearchModel {
  attributes: SearchCriteriaAttributes
  /** Artwork ID, if the current saved search alert is being set from an artwork */
  currentArtworkID?: string
  currentAlertID?: string
  dirty: boolean
  entity: SavedSearchEntity
  unit: Metric
  preview: PillPreview[]

  addValueToAttributesByKeyAction: Action<
    this,
    {
      key: SearchCriteria
      value: string | string[] | boolean | null
    }
  >
  clearAllAttributesAction: Action<this>
  removeValueFromAttributesByKeyAction: Action<
    this,
    {
      key: SearchCriteria
      value: string | string[] | number | boolean
    }
  >
  setAttributeAction: Action<this, { key: SearchCriteria; value: any }>
  setUnitAction: Action<this, Metric>
  setAlertID: Action<this, string>
  setPreviewAction: Action<this, PillPreview[]>
}

export const savedSearchModel: SavedSearchModel = {
  attributes: {},
  currentArtworkID: undefined,
  currentAlertID: undefined,
  dirty: false,
  entity: {
    artists: [],
    owner: {
      type: OwnerType.artist,
      id: "",
      slug: "",
    },
  },
  // this will be overwritten by the user's default unit when we initialize the store
  unit: "in",
  preview: [],

  addValueToAttributesByKeyAction: action((state, payload) => {
    if (payload.key === "priceRange" && typeof payload.value === "string") {
      // set form dirty on price update
      if (state.attributes[payload.key] !== payload.value) {
        state.dirty = true
      }

      // set the price range to be null if the value is *-* (which means empty)
      state.attributes[payload.key] = payload.value === "*-*" ? null : payload.value
    } else {
      state.attributes[payload.key] = payload.value as unknown as null | undefined
      state.dirty = true
    }
  }),

  clearAllAttributesAction: action((state) => {
    state.attributes = pick(state.attributes, ["artistIDs", "artistID"])
    state.dirty = true
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

  setAttributeAction: action((state, payload) => {
    state.attributes[payload.key] = payload.value
    state.dirty = true
  }),

  setUnitAction: action((state, payload) => {
    state.unit = payload
  }),

  setAlertID: action((state, payload) => {
    state.currentAlertID = payload
  }),

  setPreviewAction: action((state, payload) => {
    state.preview = payload
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
