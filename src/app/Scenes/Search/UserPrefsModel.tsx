import { UserPrefsModelQuery } from "__generated__/UserPrefsModelQuery.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Action, action, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import { getCurrencies } from "react-native-localize"
import { fetchQuery, graphql } from "react-relay"

const currencies = ["USD", "EUR", "GBP"] as const
const metrics = ["in", "cm"] as const

export type Currency = (typeof currencies)[number]
export type Metric = (typeof metrics)[number]
export type ViewOption = "grid" | "list"

// set default currency depending on device locale
const userCurrencies = getCurrencies()

const DEFAULT_CURRENCY =
  (userCurrencies.find((userCurrency) =>
    (currencies as unknown as string[]).includes(userCurrency)
  ) as Currency) ?? "USD"
const DEFAULT_METRIC = "in"
export const DEFAULT_VIEW_OPTION = "grid"
export const DEFAULT_PRICE_RANGE = "*-*"

// please update this when adding new user preferences
export interface UserPrefsModel {
  currency: Currency
  metric: Metric | ""
  priceRange: string
  defaultViewOption: ViewOption
  previouslySelectedCitySlug: string | null
  setCurrency: Action<this, Currency>
  setMetric: Action<this, Metric>
  setPriceRange: Action<this, string>
  fetchRemoteUserPrefs: Thunk<UserPrefsModel>
  didRehydrate: ThunkOn<UserPrefsModel, {}, GlobalStoreModel>
  setDefaultViewOption: Action<this, ViewOption>
  setPreviouslySelectedCitySlug: Action<this, string>
}

export const getUserPrefsModel = (): UserPrefsModel => ({
  currency: DEFAULT_CURRENCY,
  metric: DEFAULT_METRIC,
  priceRange: DEFAULT_PRICE_RANGE,
  defaultViewOption: "list",
  previouslySelectedCitySlug: null,
  setCurrency: action((state, currency) => {
    if (currencies.includes(currency)) {
      state.currency = currency
    } else {
      console.warn("Currency not supported")
    }
  }),
  setMetric: action((state, metric) => {
    if (metrics.includes(metric)) {
      state.metric = metric
    } else {
      console.warn("Metric/Dimension Unit not supported")
    }
  }),
  setPriceRange: action((state, priceRange) => {
    state.priceRange = priceRange
  }),
  fetchRemoteUserPrefs: thunk(async () => {
    const me = await fetchMe()

    if (!me) {
      return
    }

    GlobalStore.actions.userPrefs.setMetric(me?.lengthUnitPreference.toLowerCase() as Metric)
    GlobalStore.actions.userPrefs.setCurrency(me?.currencyPreference as Currency)

    if (me.priceRange) {
      const priceRange = parsePriceRange(me.priceRange)
      GlobalStore.actions.userPrefs.setPriceRange(priceRange)
    }
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      const isLoggedIn = store.getStoreState().auth.userAccessToken

      if (!!isLoggedIn) {
        actions.fetchRemoteUserPrefs()
      }
    }
  ),
  setDefaultViewOption: action((state, viewOption) => {
    state.defaultViewOption = viewOption
  }),
  setPreviouslySelectedCitySlug: action((state, citySlug) => {
    state.previouslySelectedCitySlug = citySlug
  }),
})

const fetchMe = async () => {
  const result = await fetchQuery<UserPrefsModelQuery>(
    getRelayEnvironment(),
    graphql`
      query UserPrefsModelQuery {
        me {
          lengthUnitPreference
          currencyPreference
          priceRange
        }
      }
    `,
    {}
  ).toPromise()

  return result?.me
}

const parsePriceRange = (priceRange: string) => {
  const [min, max] = priceRange.split(":").map((v) => {
    const value = parseInt(v, 10)

    if (isNaN(value)) {
      return "*"
    }

    return value
  })

  // "No budget in mind" option is selected
  if (min === -1 && max === 1000000000000) {
    return DEFAULT_PRICE_RANGE
  }

  if (min === -1) {
    return ["*", max].join("-")
  }

  return [min, max].join("-")
}
