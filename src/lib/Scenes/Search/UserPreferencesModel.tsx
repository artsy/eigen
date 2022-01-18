import { Action, action } from "easy-peasy"
import { getCurrencies } from "react-native-localize"
import { Metric } from "../MyCollection/Screens/ArtworkForm/Components/Dimensions"

// set currency depends on location
export type Currency = "USD" | "EUR" | "GBP"
const currencyRgx = /USD|EUR|GBP/
const localCurrency = getCurrencies()?.[0]

const DEFAULT_CURRENCY = currencyRgx.test(localCurrency) ? (localCurrency as Currency) : "USD"
const DEFAULT_METRIC = ""

// please update this when adding new user preferences
export interface UserPreferences {
  pricePaidCurrency: Currency
  metric: Metric
}

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
