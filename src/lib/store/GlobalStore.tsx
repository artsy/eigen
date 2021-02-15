import { action, createStore, createTypedHooks, StoreProvider } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { loadDevNavigationStateCache } from "lib/navigation/useReloadedDevNavigationState"
import React from "react"
import { Platform } from "react-native"
import Config from "react-native-config"
import { Action, Middleware } from "redux"
import { FeatureMap } from "./ConfigModel"
import { FeatureName, features } from "./features"
import { GlobalStoreModel, GlobalStoreState } from "./GlobalStoreModel"
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
      injectFeatureFlags(options: Partial<FeatureMap>) {
        this.injectState({ config: { adminFeatureFlagOverrides: options } })
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

export function useFeatureFlag(key: FeatureName) {
  if (Platform.OS === "ios") {
    return GlobalStore.useAppState((state) => state.config.features[key])
  }

  // TODO: add feature flags to GlobalStore on android
  return true
}

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used in a react component. Use `useFeatureFlag` instead.
 * It is safe to use in contexts that don't require reactivity.
 */
export function unsafe_getFeatureFlag(key: FeatureName) {
  const state = globalStoreInstance?.getState() ?? null
  if (state) {
    return state.config.features[key]
  }
  if (__DEV__) {
    throw new Error(`Unable to access ${key} before GlobalStore bootstraps`)
  }
  return features[key].readyForRelease
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
  // TODO: support non-staging environments on android
  if (Platform.OS === "android") {
    return true
  }
  return GlobalStore.useAppState((state) => state.native.sessionState.env === "staging")
}
