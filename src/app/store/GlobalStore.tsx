import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { DevToggleName, FeatureName, features } from "app/store/config/features"
import { logAction } from "app/utils/loggers"
import { Actions, createStore, createTypedHooks, StoreProvider } from "easy-peasy"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"
import { Action, Middleware } from "redux"
import logger from "redux-logger"
import { version } from "./../../../app.json"
import { getGlobalStoreModel, GlobalStoreModel, GlobalStoreState } from "./GlobalStoreModel"
import { DevToggleMap, FeatureMap } from "./config/FeaturesModel"
import { persistenceMiddleware, unpersist } from "./persistence"

function createGlobalStore() {
  const middleware: Middleware[] = []

  if (!__TEST__) {
    middleware.push(persistenceMiddleware)

    if (__DEV__) {
      if (logAction) {
        middleware.push(logger)
      }
    }
  }

  // At test time let's keep a log of all dispatched actions so that tests can make assertions based on what
  // has been dispatched
  if (__TEST__ && __globalStoreTestUtils__) {
    __globalStoreTestUtils__.dispatchedActions = []

    middleware.push((_api) => (next) => async (action) => {
      if (action.type) {
        __globalStoreTestUtils__.dispatchedActions.push(action)
      }

      const result = next(action)
      return result
    })
  }

  const store = createStore(getGlobalStoreModel(), {
    middleware,
  })

  if (!__TEST__) {
    unpersist().then(async (state) => {
      store.getActions().rehydrate(state)
    })
  }

  return store
}

export const __globalStoreTestUtils__ = __TEST__
  ? {
      // this can be used to mock the initial state before mounting a test renderer
      // e.g. `__globalStoreTestUtils__?.injectState({ nativeState: { selectedTab: "sell" } })`
      // takes effect until the next test starts
      injectState: (state: DeepPartial<GlobalStoreState>) => {
        GlobalStore.actions.__inject(state)
      },
      setProductionMode() {
        this.injectState({ devicePrefs: { environment: { env: "production" } } })
      },
      injectFeatureFlags(options: Partial<FeatureMap> | Partial<DevToggleMap>) {
        this.injectState({ artsyPrefs: { features: { localOverrides: options } } })
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
  get actions(): Actions<GlobalStoreModel> {
    return globalStoreInstance().getActions()
  },
}

export const GlobalStoreProvider: React.FC<{}> = ({ children }) => {
  return <StoreProvider store={globalStoreInstance()}>{children}</StoreProvider>
}

let _globalStoreInstance: ReturnType<typeof createGlobalStore> | undefined
export const globalStoreInstance = (): ReturnType<typeof createGlobalStore> => {
  if (_globalStoreInstance === undefined) {
    _globalStoreInstance = createGlobalStore()
  }
  return _globalStoreInstance
}

export function getCurrentEmissionState() {
  const state = globalStoreInstance().getState() ?? null

  // `getUserAgentSync` breaks the Chrome Debugger, so we use a string instead.
  //
  // Note also that the specific format of the user-agent string that is constructed here
  // may be relied upon by Metaphysics for determining what content to present to Eigen.
  // See: https://github.com/artsy/metaphysics/pull/6297
  const userAgent = `${
    __DEV__ ? "Artsy-Mobile " + Platform.OS : DeviceInfo.getUserAgentSync()
  } ${DeviceInfo.getSystemName()}/${DeviceInfo.getSystemVersion()} Artsy-Mobile/${version} Eigen/${DeviceInfo.getBuildNumber()}/${version}`

  const data: GlobalStoreModel["native"]["sessionState"] = {
    authenticationToken: state?.auth.userAccessToken || "",
    launchCount: ArtsyNativeModule.launchCount,
    userAgent,
    userID: state?.auth.userID || "",
    userEmail: "user@example.com", // not used on android
  }
  return data
}

// Unsafe calls. Must be colocated here:

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used in a react component. Use `useFeatureFlag` instead.
 * It is safe to use in contexts that don't require reactivity.
 */
export function unsafe_getFeatureFlag(key: FeatureName): boolean {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.artsyPrefs.features.flags[key]
  }
  if (__DEV__) {
    throw new Error(`Unable to access ${key} before GlobalStore bootstraps`)
  }
  return features[key].readyForRelease
}

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used in a react component. Use GlobalStore.useAppState instead.
 * It is safe to use in contexts that don't require reactivity.
 */
export function unsafe_getPushPromptSettings() {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.artsyPrefs.pushPromptLogic
  }
  return null
}

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used in a react component. Use `useLocalizedUnit` instead.
 * It is safe to use in contexts that don't require reactivity.
 */
export function unsafe_getLocalizedUnit() {
  const state = globalStoreInstance().getState()
  if (state) {
    return state.userPrefs.metric
  }
  if (__DEV__) {
    throw new Error(`Unable to access metric before GlobalStore bootstraps`)
  }
}

export function unsafe_getDevToggle(key: DevToggleName) {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.artsyPrefs.features.devToggles[key]
  }
  if (__DEV__) {
    throw new Error(`Unable to access ${key} before GlobalStore bootstraps`)
  }
  return false
}

export function unsafe_getUserAccessToken() {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.auth.userAccessToken
  }
  if (__DEV__) {
    throw new Error(`Unable to access userAccessToken before GlobalStore bootstraps`)
  }
  return null
}

export function unsafe_getUserEmail() {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.auth.userEmail
  }
  if (__DEV__) {
    throw new Error(`Unable to retrieve user email`)
  }
  return null
}

export function unsafe_getIsNavigationReady() {
  const state = globalStoreInstance().getState() ?? null
  if (state) {
    return state.sessionState.isNavigationReady
  }
  if (__DEV__) {
    throw new Error(`Unable to nav state`)
  }
  return null
}

/**
 * This is marked as unsafe because it will not cause a re-render
 * if used during a react component's render. Use `useEnvironment` instead.
 * This is safe to use in contexts that don't require reactivity, e.g. onPress handlers.
 */
export function unsafe__getEnvironment() {
  const {
    echo: { stripePublishableKey },
    userIsDev: { value },
  } = globalStoreInstance().getState().artsyPrefs
  const {
    environment: { env, strings },
  } = globalStoreInstance().getState().devicePrefs
  return { ...strings, stripePublishableKey, env, userIsDev: value }
}

export function unsafe_getDevPrefs() {
  return globalStoreInstance().getState().devicePrefs
}
