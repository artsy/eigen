import { Action, action } from "easy-peasy"

const DEFAULT_CURRENCY = "USD"

export type Currency = "USD" | "EUR" | "GBP"

export interface UserPreferencesModel {
  currency: Currency
  setCurrency: Action<this, Currency>
}

export const getUserPreferencesModel = (): UserPreferencesModel => ({
  currency: DEFAULT_CURRENCY,
  setCurrency: action((state, currency) => {
    state.currency = currency
  }),
})
