import {
  NewArtworkFilterStoreModel,
  getNewArtworkFilterStoreModel,
} from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { NewFilterData, NewFilterParamName } from "app/Components/NewArtworkFilter/helpers"
import { createStore } from "easy-peasy"

const createFilterArtworksStore = (state?: Partial<NewArtworkFilterStoreModel>) =>
  createStore<NewArtworkFilterStoreModel>({ ...getNewArtworkFilterStoreModel(), ...state })

describe("NewArtworkFilterStore", () => {
  describe("initialState", () => {
    it("is correct when no injections are made", () => {
      const store = createFilterArtworksStore()
      expect(store.getState().previouslyAppliedFilters).toEqual([])
      expect(store.getState().selectedFilters).toEqual([])
    })
    it("is correct when injections are made", () => {
      const store = createFilterArtworksStore({
        previouslyAppliedFilters,
      })
      expect(store.getState().previouslyAppliedFilters).toEqual(previouslyAppliedFilters)
      expect(store.getState().selectedFilters).toEqual([])
    })
  })
})

const previouslyAppliedFilters: NewFilterData[] = [
  {
    paramName: NewFilterParamName.categories,
    paramValue: {
      value: "painting",
      displayLabel: "Painting",
    },
  },
]
