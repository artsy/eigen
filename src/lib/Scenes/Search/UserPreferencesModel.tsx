import { Action, action } from "easy-peasy"
import { Metric } from "../MyCollection/Screens/ArtworkForm/Components/Dimensions"

// TODO: set currency depends on location
const DEFAULT_CURRENCY = "USD"
const DEFAULT_METRIC = ""

// please update this when adding new user preferences
export interface UserPreferences {
  pricePaidCurrency: Currency
  metric: Metric
}

export type Currency = "USD" | "EUR" | "GBP"

export interface UserPreferencesModel {
  currency: Currency
  metric: Metric
  setCurrency: Action<this, Currency>
  setMetric: Action<this, Metric>
}

export const getUserPreferencesModel = (): UserPreferencesModel => ({
  currency: DEFAULT_CURRENCY,
  metric: DEFAULT_METRIC,
  setCurrency: action((state, currency) => {
    state.currency = currency
    // TODO: update currency in gravity
  }),
  setMetric: action((state, metric) => {
    state.metric = metric
    // TODO: update unit in gravity
  }),
})
