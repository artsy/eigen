import CookieManager from "@react-native-cookies/cookies"
import { Action, action, createStore, State, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import * as RelayCache from "lib/relay/RelayCache"
import { BottomTabsModel, getBottomTabsModel } from "lib/Scenes/BottomTabs/BottomTabsModel"
import { getMyCollectionModel, MyCollectionModel } from "lib/Scenes/MyCollection/State/MyCollectionModel"
import { getSearchModel, SearchModel } from "lib/Scenes/Search/SearchModel"
import { Platform } from "react-native"
import { AuthModel, getAuthModel } from "./AuthModel"
import { getConfigModel, ConfigModel } from "./ConfigModel"
import { unsafe__getEnvironment } from "./GlobalStore"
import { CURRENT_APP_VERSION } from "./migration"
import { getNativeModel, NativeModel } from "./NativeModel"
import { assignDeep, sanitize } from "./persistence"

interface GlobalStoreStateModel {
  version: number
  sessionState: {
    isHydrated: boolean
  }

  native: NativeModel

  bottomTabs: BottomTabsModel
  search: SearchModel
  myCollection: MyCollectionModel
  config: ConfigModel
  auth: AuthModel
}
export interface GlobalStoreModel extends GlobalStoreStateModel {
  rehydrate: Action<GlobalStoreModel, DeepPartial<State<GlobalStoreStateModel>>>
  manipulate: Action<GlobalStoreModel, (store: GlobalStoreModel) => void>
  reset: Action<GlobalStoreModel, DeepPartial<State<GlobalStoreStateModel>>>
  signOut: Thunk<GlobalStoreModel>
  didRehydrate: ThunkOn<GlobalStoreModel>

  // for testing only. noop otherwise.
  __injectState: Action<GlobalStoreModel, DeepPartial<State<GlobalStoreStateModel>>>
  __manipulateState: Action<GlobalStoreModel, (store: GlobalStoreModel) => void>
}

export const getGlobalStoreModel = (): GlobalStoreModel => ({
  // META STATE
  version: CURRENT_APP_VERSION,
  rehydrate: action((state, unpersistedState) => {
    if (!__TEST__ && state.sessionState.isHydrated) {
      console.error("The store was already hydrated. `rehydrate` should only be called once.")
      return
    }
    assignDeep(state, unpersistedState)
    state.sessionState.isHydrated = true
  }),
  manipulate: action((state, theEdits) => {
    theEdits(state)
  }),
  reset: action((_, state) => {
    const result = createStore(getGlobalStoreModel()).getState()
    result.sessionState.isHydrated = true
    assignDeep(result, state)
    return result
  }),
  signOut: thunk(async (actions, _, store) => {
    // keep existing config state
    const existingConfig = store.getState().config
    const config = sanitize(existingConfig) as typeof existingConfig
    if (Platform.OS === "ios") {
      await LegacyNativeModules.ARTemporaryAPIModule.clearUserData()
    }
    CookieManager.clearAll()
    RelayCache.clearAll()
    actions.reset({ config })
  }),
  didRehydrate: thunkOn(
    (actions) => actions.rehydrate,
    () => {
      LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
      LegacyNativeModules.ARNotificationsManager.didFinishBootstrapping()
    }
  ),
  sessionState: {
    // we don't perform hydration at test time so let's set it to always true for tests
    isHydrated: __TEST__,
  },

  // NATIVE MIGRATION STATE
  native: getNativeModel(),

  // APP MODULE STATE
  bottomTabs: getBottomTabsModel(),
  search: getSearchModel(),
  myCollection: getMyCollectionModel(),
  config: getConfigModel(),
  auth: getAuthModel(),

  // for testing only. noop otherwise.
  __injectState: __TEST__
    ? action((state, injectedState) => {
        assignDeep(state, injectedState)
      })
    : action(() => {}),
  __manipulateState: __TEST__
    ? action((state, theEdits) => {
        theEdits((state as unknown) as GlobalStoreModel)
      })
    : action(() => {}),
})

export type GlobalStoreState = State<GlobalStoreModel>
