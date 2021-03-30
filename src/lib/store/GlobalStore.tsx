import { createStore, createTypedHooks, StoreProvider } from "easy-peasy"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { loadDevNavigationStateCache } from "lib/navigation/useReloadedDevNavigationState"
import React from "react"
import { Platform } from "react-native"
import { Action, Middleware } from "redux"
import { DevToggleName, FeatureName, features } from "./config/features"
import { FeatureMap } from "./config/FeaturesModel"
import { getGlobalStoreModel, GlobalStoreModel, GlobalStoreState } from "./GlobalStoreModel"
import { persistenceMiddleware, unpersist } from "./persistence"

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

  const store = createStore(getGlobalStoreModel(), {
    middleware,
  })

  if (!__TEST__) {
    unpersist().then(async (state) => {
      await loadDevNavigationStateCache(store.getActions().bottomTabs.switchTab)
      store.getActions().rehydrate(state)
    })
  }

  return store
}

// tslint:disable-next-line:variable-name
export const __globalStoreTestUtils__ = __TEST__
  ? {
      // this can be used to mock the initial state before mounting a test renderer
      // e.g. `__globalStoreTestUtils__?.injectState({ nativeState: { selectedTab: "sell" } })`
      // takes effect until the next test starts
      injectState: (state: DeepPartial<GlobalStoreState>) => {
        GlobalStore.actions.__inject(state)
      },
      setProductionMode() {
        this.injectState({ config: { environment: { env: "production" } } })
      },
      injectFeatureFlags(options: Partial<FeatureMap>) {
        this.injectState({ config: { features: { adminOverrides: options } } })
      },
      getCurrentState: () => globalStoreInstance().getState(),
      dispatchedActions: [] as Action[],
      getLastAction() {
        return this.dispatchedActions[this.dispatchedActions.length - 1]
      },
      reset: () => {
        _globalStoreInstance = undefined
      },
    }
  : undefined

if (__TEST__) {
  beforeEach(() => {
    __globalStoreTestUtils__?.reset()
  })
}

const hooks = createTypedHooks<GlobalStoreModel>()

export const GlobalStore = {
  useAppState: hooks.useStoreState,
  get actions() {
    return globalStoreInstance().getActions()
  },
}

export const GlobalStoreProvider: React.FC<{}> = ({ children }) => {
  return <StoreProvider store={globalStoreInstance()}>{children}</StoreProvider>
}

export function useSelectedTab() {
  return hooks.useStoreState((state) => state.bottomTabs.sessionState.selectedTab)
}

let _globalStoreInstance: ReturnType<typeof createGlobalStore> | undefined
const globalStoreInstance = (): ReturnType<typeof createGlobalStore> => {
  if (_globalStoreInstance === undefined) {
    _globalStoreInstance = createGlobalStore()
  }
  return _globalStoreInstance
}

export function useFeatureFlag(key: FeatureName) {
  return GlobalStore.useAppState((state) => state.config.features.flags[key])
}

export function useDevToggle(key: DevToggleName) {
  return GlobalStore.useAppState((state) => state.config.features.devToggles[key])
}

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used in a react component. Use `useFeatureFlag` instead.
 * It is safe to use in contexts that don't require reactivity.
 */
export function unsafe_getFeatureFlag(key: FeatureName) {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.config.features.flags[key]
  }
  if (__DEV__) {
    throw new Error(`Unable to access ${key} before GlobalStore bootstraps`)
  }
  return features[key].readyForRelease
}

export function unsafe_getDevToggle(key: DevToggleName) {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.config.features.devToggles[key]
  }
  if (__DEV__) {
    throw new Error(`Unable to access ${key} before GlobalStore bootstraps`)
  }
  return false
}

export function getCurrentEmissionState() {
  const state = globalStoreInstance().getState() ?? null
  if (Platform.OS === "ios") {
    return state?.native.sessionState ?? LegacyNativeModules.ARNotificationsManager.nativeState
  }

  const androidData: GlobalStoreModel["native"]["sessionState"] = {
    authenticationToken: state?.auth.userAccessToken!,
    deviceId: "Android", // TODO: get better device info
    launchCount: ArtsyNativeModule.launchCount,
    onboardingState: "none", // not used on android
    userAgent: "Artsy-Mobile android", // TODO: proper user agent
    userID: state?.auth.userID!,
  }
  return androidData
}

/**
 * This is safe, but is marked unsafe because it should not be used within react components since it does not cause re-renders.
 * Use `useSelectedTab` in react components, and use this in rare cases where you need to know the current tab outside of
 * react components.
 */
export function unsafe__getSelectedTab() {
  return globalStoreInstance().getState().bottomTabs.sessionState.selectedTab
}

export function useIsStaging() {
  return GlobalStore.useAppState((state) => state.config.environment.env === "staging")
}

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used during a react component's render. Use `useEnvironment` instead.
 * This is safe to use in contexts that don't require reactivity, e.g. onPress handlers.
 */
export function unsafe__getEnvironment() {
  const {
    environment: { env, strings },
    echo: { stripePublishableKey },
  } = globalStoreInstance().getState().config
  return { ...strings, stripePublishableKey, env }
}

export function useEnvironment() {
  const {
    environment: { env, strings },
    echo: { stripePublishableKey },
  } = GlobalStore.useAppState((state) => state.config)
  return { ...strings, stripePublishableKey, env }
}
