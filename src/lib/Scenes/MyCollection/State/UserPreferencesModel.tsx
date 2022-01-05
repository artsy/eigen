import { action, Action } from "easy-peasy"
import { Metric } from "../Screens/ArtworkForm/Components/Dimensions"

const DEFAULT_DIMENSION_UNIT = ""

export interface UserPreferencesModel {
  dimensionUnit: Metric
  setDimensionUnit: Action<this, Metric>
}

export const getUserPreferencesModel = (): UserPreferencesModel => ({
  dimensionUnit: DEFAULT_DIMENSION_UNIT,
  setDimensionUnit: action((state, dimensionUnit) => {
    state.dimensionUnit = dimensionUnit
  }),
})
