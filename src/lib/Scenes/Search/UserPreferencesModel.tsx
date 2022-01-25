import { Action, action } from "easy-peasy"
import { getCurrencies } from "react-native-localize"

const currencies = ["USD", "EUR", "GBP"] as const
const metrics = ["in", "cm"] as const

export type Currency = typeof currencies[number]
export type Metric = typeof metrics[number]

// set default currency depending on device locale
const userCurrencies = getCurrencies()

const DEFAULT_CURRENCY =
  (userCurrencies.find((userCurrency) =>
    (currencies as unknown as string[]).includes(userCurrency)
  ) as Currency) ?? "USD"
const DEFAULT_METRIC = ""

// please update this when adding new user preferences
export interface UserPreferences {
  pricePaidCurrency: Currency
  metric: Metric
}

export interface UserPreferencesModel {
  currency: Currency
  metric: Metric | ""
  setCurrency: Action<this, Currency>
  setMetric: Action<this, Metric>
}

export const getUserPreferencesModel = (): UserPreferencesModel => ({
  currency: DEFAULT_CURRENCY,
  metric: DEFAULT_METRIC,
  setCurrency: action((state, currency) => {
    if (currencies.includes(currency)) {
      state.currency = currency
    } else {
      console.warn("Currency not supported")
    }

    // TODO: update currency in gravity
  }),
  setMetric: action((state, metric) => {
    if (metrics.includes(metric)) {
      state.metric = metric
    } else {
      console.warn("Metric/Dimension Unit not supported")
    }

    // TODO: update unit in gravity
  }),
})
