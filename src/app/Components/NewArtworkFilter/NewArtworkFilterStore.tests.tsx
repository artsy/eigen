import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
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
      expect(store.getState().appliedFilters).toEqual([])
      expect(store.getState().allFilters).toEqual([])
      expect(store.getState().aggregations).toEqual([])
      expect(store.getState().notAppliedFilters).toEqual([])
    })
    it("is correct when injections are made", () => {
      const store = createFilterArtworksStore({
        appliedFilters,
        aggregations,
      })
      expect(store.getState().appliedFilters).toEqual(appliedFilters)
      expect(store.getState().allFilters).toEqual(appliedFilters)
      expect(store.getState().aggregations).toEqual(aggregations)
      expect(store.getState().notAppliedFilters).toEqual([])
    })
  })
})

const appliedFilters: NewFilterData[] = [
  {
    paramName: NewFilterParamName.categories,
    paramValue: {
      value: "painting",
      displayLabel: "Painting",
    },
  },
]

const aggregations: Aggregations = [
  {
    slice: "COLOR",
    counts: [
      {
        count: 10,
        value: "blue",
        name: "Blue",
      },
    ],
  },
]
