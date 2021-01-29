import { action, createStore, createTypedHooks, StoreProvider } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { loadDevNavigationStateCache } from "lib/navigation/useReloadedDevNavigationState"
import React from "react"
import { Platform } from "react-native"
import Config from "react-native-config"
import { Action, Middleware } from "redux"
import { GlobalStoreModel, GlobalStoreState } from "./GlobalStoreModel"
import { EmissionOptions } from "./NativeModel"
import { assignDeep, persistenceMiddleware, unpersist } from "./persistence"

function createGlobalStore() {
  const middleware: Middleware[] = []

  if (!__TEST__) {
    middleware.push(persistenceMiddleware)
  }

  // At dev time but not test time, let's log out each action that is dispatched
  if (__DEV__ && !__TEST__) {
    middleware.push((_api) => (next) => (_action) => {
      console.log(`ACTION ${_action.type}`, _action)
      next(_action)
    })
  }

  // At test time let's keep a log of all dispatched actions so that tests can make assertions based on what
  // has been dispatched
  if (__TEST__ && __globalStoreTestUtils__) {
    __globalStoreTestUtils__.dispatchedActions = []
    middleware.push((_api) => (next) => (_action) => {
      __globalStoreTestUtils__.dispatchedActions.push(_action)
      next(_action)
    })
  }

  if (__TEST__) {
    ;(GlobalStoreModel as any).__injectState = action((state, injectedState) => {
      assignDeep(state, injectedState)
    })
  }

  const store = createStore<GlobalStoreModel>(GlobalStoreModel, {
    middleware,
  })

  if (!__TEST__) {
    unpersist().then(async (state) => {
      await loadDevNavigationStateCache()
      store.getActions().rehydrate(state)
    })
  }

  return store
}

// tslint:disable-next-line:variable-name
export const __globalStoreTestUtils__ = __TEST__
  ? {
      // this can be used to mock the initial state before mounting a test renderer
      // e.g. `__globalStoreTestUtils__.injectState({ nativeState: { selectedTab: "sell" } })`
      // takes effect until the next test starts
      injectState(state: DeepPartial<GlobalStoreState>) {
        ;(GlobalStore.actions as any).__injectState(state)
      },
      injectEmissionOptions(options: Partial<EmissionOptions>) {
        this.injectState({ native: { sessionState: { options } } })
      },
      getCurrentState: () => globalStoreInstance.getState(),
      dispatchedActions: [] as Action[],
      getLastAction() {
        return this.dispatchedActions[this.dispatchedActions.length - 1]
      },
      reset: () => {
        globalStoreInstance = createGlobalStore()
      },
    }
  : null

if (__TEST__) {
  beforeEach(() => {
    __globalStoreTestUtils__?.reset()
  })
}

const hooks = createTypedHooks<GlobalStoreModel>()

export const GlobalStore = {
  useAppState: hooks.useStoreState,
  get actions() {
    return globalStoreInstance.getActions()
  },
}

export const GlobalStoreProvider: React.FC<{}> = ({ children }) => {
  return <StoreProvider store={globalStoreInstance}>{children}</StoreProvider>
}

export function useSelectedTab() {
  return hooks.useStoreState((state) => state.bottomTabs.sessionState.selectedTab)
}

let globalStoreInstance = createGlobalStore()

export function useEmissionOption(key: keyof EmissionOptions) {
  if (Platform.OS === "ios") {
    return GlobalStore.useAppState((state) => state.native.sessionState.options[key])
  }

  // TODO: add feature flags to GlobalStore on android
  return true
}

export function getCurrentEmissionState() {
  const state = globalStoreInstance?.getState() ?? null
  if (Platform.OS === "ios") {
    return state?.native.sessionState ?? LegacyNativeModules.ARNotificationsManager.nativeState
  }

  const androidData: GlobalStoreModel["native"]["sessionState"] = {
    authenticationToken: state?.auth.userAccessToken!,
    deviceId: "Android", // TODO: get better device info
    env: "staging", // TODO: add production support
    gravityURL: state?.config.sessionState.gravityBaseURL,
    launchCount: 1, // TODO: add support for this somehow??
    legacyFairProfileSlugs: [], // TODO: take from echo
    legacyFairSlugs: [], // TODO: take from echo
    metaphysicsURL: state?.config.sessionState.metaphysicsBaseURL,
    onboardingState: "none", // not used on android
    options: {
      // TODO: store options in easy-peasy
      AROptionsBidManagement: true,
      AROptionsEnableMyCollection: true,
      AROptionsLotConditionReport: true,
      AROptionsPriceTransparency: true,
      AROptionsViewingRooms: true,
      AROptionsNewSalePage: true,
      AREnableViewingRooms: true,
      AROptionsArtistSeries: true,
      ipad_vir: false,
      iphone_vir: false,
      ARDisableReactNativeBidFlow: false,
      AREnableNewPartnerView: true,
      AROptionsNewFirstInquiry: true,
      AROptionsUseReactNativeWebView: true,
      AROptionsNewFairPage: true,
      AROptionsNewInsightsPage: true,
      AROptionsInquiryCheckout: true,
      AROptionsSentryErrorDebug: true,
    },
    predictionURL: state?.config.sessionState.predictionBaseURL,
    sentryDSN: Config.SENTRY_STAGING_DSN,
    stripePublishableKey: "stripePublishableKey", // TODO: take key from echo config
    userAgent: "eigen android", // TODO: proper user agent
    userID: state?.auth.userID!,
    webURL: state?.config.sessionState.webURL,
  }
  return androidData
}

/**
 * This is safe, but is marked unsafe because it should not be used within react components since it does not cause re-renders.
 * Use `useSelectedTab` in react components, and use this in rare cases where you need to know the current tab outside of
 * react components.
 */
export function unsafe__getSelectedTab() {
  return globalStoreInstance?.getState().bottomTabs.sessionState.selectedTab
}

export function useIsStaging() {
  return GlobalStore.useAppState((state) => state.native.sessionState.env === "staging")
}
