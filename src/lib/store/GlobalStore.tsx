import { action, createTypedHooks, StoreProvider } from "easy-peasy"
import { createStore } from "easy-peasy"
import React from "react"
import { Action, Middleware } from "redux"
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
    unpersist().then((state) => {
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

export function useEmissionOption(_key: string) {
  return true
}

export function getCurrentEmissionState() {
  // on initial load globalStoreInstance might be undefined
  return {
    legacyFairSlugs: [] as string[],
    legacyFairProfileSlugs: [] as string[],
    env: "staging" as "staging",
    sentryDSN: null,
    launchCount: 1,
    stripePublishableKey: "nope",
    predictionURL: "https://live-staging.artsy.net/",
    options: {
      AROptionsBidManagement: true,
      AROptionsEnableMyCollection: true,
      AROptionsLotConditionReport: true,
      AROptionsPriceTransparency: true,
      AROptionsViewingRooms: true,
      AROptionsNewSalePage: true,
      AREnableViewingRooms: true,
      AROptionsArtistSeries: true,
      ipad_vir: true,
      iphone_vir: true,
      ARDisableReactNativeBidFlow: true,
      AREnableNewPartnerView: true,
      AROptionsNewFirstInquiry: true,
      AROptionsUseReactNativeWebView: true,
      AROptionsNewShowPage: true,
      AROptionsNewFairPage: true,
      AROptionsNewInsightsPage: true,
    },
    authenticationToken: globalStoreInstance?.getState().auth.userAccessToken!,
    userAgent: "blah",
    userID: globalStoreInstance?.getState().auth.userID!,
    metaphysicsURL: "https://metaphysics-staging.artsy.net/v2",
    gravityURL: "https://stagingapi.artsy.net",
  }
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
  return true
}
