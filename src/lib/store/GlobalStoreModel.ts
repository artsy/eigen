import { Action, action, createStore, State, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { clearAll } from "lib/relay/RelayCache"
import { BottomTabsModel } from "lib/Scenes/BottomTabs/BottomTabsModel"
import { MyCollectionModel } from "lib/Scenes/MyCollection/State/MyCollectionModel"
import { SearchModel } from "lib/Scenes/Search/SearchModel"
import { Platform } from "react-native"
import { AuthModel } from "./AuthModel"
import { ConfigModel } from "./ConfigModel"
import { unsafe__getEnvironment } from "./GlobalStore"
import { CURRENT_APP_VERSION } from "./migration"
import { NativeModel } from "./NativeModel"
import { assignDeep, sanitize } from "./persistence"

interface GlobalStoreStateModel {
  version: number
  sessionState: {
    isHydrated: boolean
    didSessionExpire: boolean
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
  reset: Action<GlobalStoreModel, DeepPartial<State<GlobalStoreStateModel>>>
  signOut: Thunk<GlobalStoreModel>
  didRehydrate: ThunkOn<GlobalStoreModel>
}

export const GlobalStoreModel: GlobalStoreModel = {
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
  reset: action((_, state) => {
    const result = createStore(GlobalStoreModel).getState()
    result.sessionState.isHydrated = true
    return assignDeep(result, state)
  }),
  signOut: thunk(async (actions, _, store) => {
    // keep existing config state
    const existingConfig = store.getState().config
    const config = sanitize(existingConfig) as typeof existingConfig
    if (Platform.OS === "ios") {
      LegacyNativeModules.ARTemporaryAPIModule.clearUserData()
    }
    clearAll()
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
    didSessionExpire: false,
  },

  // NATIVE MIGRATION STATE
  native: NativeModel,

  // APP MODULE STATE
  bottomTabs: BottomTabsModel,
  search: SearchModel,
  myCollection: MyCollectionModel,
  config: ConfigModel,
  auth: AuthModel,
}

export type GlobalStoreState = State<GlobalStoreModel>
